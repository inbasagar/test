import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../Models/ProductModel.js";
//import products from './../data/Products';
import { admin, protect } from "./../Middleware/AuthMiddleware.js";
const productRoute=express.Router();
/*
productRoute.get(
    "/",
    asyncHandler(async(req,res)=>
    {
        const products=await Product.find({});
        res.json(products);
    })
);
*/
// GET ALL PRODUCT
// GET ALL PRODUCT
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: 1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
/*
productRoute.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const pageSize = 2;
    const page = Number(req.query.pageNumber) || 1;
      const count = await Product.countDocuments({});
    const products = await Product.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ _id: 1 });
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
  //  res.json(products);
  })
);
*/

productRoute.get(
  "/all",

  asyncHandler(async (req, res) => {
    const pageSize = 1;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: 1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
/*
productRoute.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);
*/

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);


  
// DELETE PRODUCT
productRoute.delete(
    "/:id",

    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.remove();
        res.json({ message: "Product deleted" });
      } else {
        res.status(404);
        throw new Error("Product not Found");
      }
    })
  );
  
// CREATE PRODUCT
productRoute.post(
  "/",

  asyncHandler(async (req, res) => {
    const { name, price, description, image, countInStock,height,width} = req.body;
    const productExist = await Product.findOne({ name });
    {/*if (productExist) {
      res.status(400);
      throw new Error("Product name already exist");
    } else { */}
      const product = new Product({
        name,
        price,
        description,
        image,
        countInStock,
        //user: req.user._id,
        height,
        width,

      });
      if (product) {
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    {/** }*/}
  })
);
  
  // UPDATE PRODUCT
  productRoute.put(
    "/:id",

    asyncHandler(async (req, res) => {
      const { name, price, description, image, countInStock,height,width} = req.body;
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;
        product.height=height|| product.height;
        product.width=width||product.width;
        {/** 
        product.price_11X11=price_11X11||product.price_11X11;
        product.price_15X12=price_15X12||product.price_15X12;
        product.price_10X8=price_10X8||product.price_10X8;
        product.price_10X12=price_10X12||product.price_10X12;
        product.price_12X15=price_12X15||product.price_12X15;
        */}
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404);
        throw new Error("Product not found");
      }
    })
  );



export default productRoute;