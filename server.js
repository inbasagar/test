import express, { json } from "express";
import products from "./data/Products.js";
import dotenv from "dotenv"
import connectDb from "./config/MongoDb.js";
import ImportData from "./Dataimport.js";
import productRoute from "./Routes/ProductRoutes.js";
import {errorHandler,notFound} from "./Middleware/Error.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import cors from 'cors';
import sgMail from '@sendgrid/mail';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
connectDb();
app.use("/api/import",ImportData);
app.use("/api/products",productRoute);
app.use("/api/users",userRouter);
app.use("/api/orders",orderRouter);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
/* app.get("/api/products",(req,res)=>{
    res.json(products);
})
app.get("/api/products/:id",(req,res)=>
{
    const product= products.find((p)=>p._id===req.params.id);
    res.json(product);
})
*/
/*app.get("/",(req,res)=>
{
    res.send("Server is running");
});
*/
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;
app.listen(PORT, console.log(`FROM LOG SERVER RUNNING IN ${PORT}`));