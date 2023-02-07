import express from "express";
import { body, validationResult } from "express-validator";
import isAuthenticated from "../middlewares/isAuthenticated";
import { Product } from "../services/mongoDB/models/Product";
const router3 = express.Router();

let message = {
  success: false,
  data: null,
  message: "",
};

//add product route
router3.post(
  "/add",
  isAuthenticated,
  body("productName")
    .isLength({ min: 3 })
    .withMessage("Product Name is too short"),
  body("category").notEmpty().withMessage("All input fields are required"),
  body("gender").notEmpty().withMessage("All input fields are required"),
  body("brand").notEmpty().withMessage("All input fields are required"),
  body("stock").notEmpty().withMessage("All input fields are required"),
  body("description").notEmpty().withMessage("All input fields are required"),
  body("imageURL").notEmpty().withMessage("All input fields are required"),
  body("size").notEmpty().withMessage("All input fields are required"),
  body("price").notEmpty().withMessage("All input fields are required"),
  async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        message ={
            success : false,
            data : null,
            message : errors.array()[0].msg
        }
        return res.status(400).json(message)
    }
    try {
        const product = new Product({...req.body});
        await product.save()
        message ={
            success : true,
            data : product,
            message : "Product Created 😊"
        }
        return res.status(200).json(message)
    } catch (error) {
        message ={
            success : false,
            data : null,
            message : error.message
        }
        return res.status(400).json(message)
    }
  }
);

// get all products 
router3.get('/getProducts',async (req,res) => {
  try {
    const products = await Product.find().populate({
      path:'reviews',
      select:'stars'
    });
    message ={
      success : true,
      data : products,
      message : "Successfully Fetched Products"
  }
  return res.status(200).json(message)
  } catch (error) {
    console.log(error.message)
    message ={
      success : false,
      data : null,
      message : error.message
  }
  return res.status(400).json(message)
  }
})

//get single product by id
router3.get('/getProduct/:productId',async(req,res) => {
  try {
    const {productId} = req.params
    const product = await Product.findOne({_id: productId}).populate({
      path : 'reviews',
      populate:{
        path:'user',
        select:['avtar','userName']
      },
    })
    message ={
      success : true,
      data : product,
      message : "Success"
  }
  return res.status(200).json(message)
  } catch (error) {
    console.log(error.message)
    message ={
      success : false,
      data : null,
      message : error.message
  }
  return res.status(400).json(message)
  }
})
export default router3;
