import express from "express";
import { Order } from "../services/mongoDB/models/Order";
const router6 = express.Router();

let message = {
    success: false,
    data: null,
    message: "",
  };
router6.get('/getOrders/:cId',async(req, res) => {
  const {cId} = req.params
  console.log(cId)
    try {
      const orders = await Order.find({customerId:cId});
      message = {
        success: true,
        data: orders,
        message: "Success",
      };
      return res.status(200).send(message);
    } catch (error) {
      console.log(error.message)
      message = {
        success: false,
        data: null,
        message: "Unable To Fetch Order",
      };
      return res.status(401).send(message);
    }
  })
  router6.get('/getOrders',async (req,res)=>{
    try {
      const orders = await Order.find({})
      message = {
        success: true,
        data: orders,
        message: "Success",
      };
      return res.status(200).send(message);
    } catch (error) {
      console.log(error.message)
      message = {
        success: false,
        data: null,
        message: "Unable To Fetch Order",
      };
      return res.status(400).send(message);
    }
  })
  router6.patch('/update/:orderId',async (req, res) => {
    try {
      const {orderId} = req.params
      const data = req.body
      const updateOrder = await Order.findByIdAndUpdate(orderId,{$set:data},{new:true})
      if(updateOrder){
        const order = await Order.find({})
        message = {
          success: true,
          data: order,
          message: "Order Updated",
        };
        return res.status(200).send(message);
      }
    } catch (error) {
      console.log(error.message)
      message = {
        success: false,
        data: null,
        message: "Unable To Update Order",
      };
      return res.status(400).send(message);
    }
  })
  export default router6