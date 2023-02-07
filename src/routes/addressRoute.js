import express from "express";
import { body, validationResult } from "express-validator";
import isAuthenticated from "../middlewares/isAuthenticated";
import { Address } from "../services/mongoDB/models/Address";

const router2 = express.Router();
// message object
let message = {
  success: false,
  data: null,
  message: "",
};

//add address to database
router2.post(
  "/user/:userId",
  isAuthenticated,
  body("fullName").isLength({ max: 30 }),
  body("state").isLength({ max: 20 }),
  body("city").isLength({ max: 20 }),
  body("zip").isLength({ min: 6 }),
  body("address").isLength({ max: 150 }),
  body("contactNumber")
    .isNumeric()
    .isLength({ minx: 10 })
    .withMessage("Please enter 10 digit number"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      message = {
        success: false,
        data: null,
        message: errors.array()[0].msg,
      };
      return res.status(401).send(message);
    }
    try {
      const { userId } = req.params;
      const address = new Address({ ...req.body, user: userId });
      await address.save();
      message = {
        success: true,
        data: address,
        message: "Address added successfully😊",
      };
      return res.send(message);
    } catch (error) {
      message = {
        success: false,
        data: null,
        message: error.message,
      };
      console.log(error.message);
      return res.status(401).send(message);
    }
  }
);

//get the address by userId
router2.get("/user/:userId", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const address = await Address.find({ user: userId });
    if(address){
        message = {
          success: true,
          data: address,
          message: "Successfully Fetched",
        };
        res.status(200).send(message);
    }
  } catch (error) {
    message = {
      success: false,
      data: null,
      message: error.message,
    };
    res.status(401).send(message);
  }
});

//delete address by addressId
router2.delete('/delete/:addressId',async(req,res)=>{
  try {
    const {addressId} = req.params;
    const deletedAddress = await Address.findByIdAndDelete({_id: addressId})
    if(deletedAddress) {
      message = {
        success: true,
        data: deletedAddress,
        message: 'Successfully Deleted Address',
      };
     return res.status(200).send(message);   
    }
  } catch (error) {
    message = {
      success: false,
      data: null,
      message: error.message,
    };
    return res.status(401).send(message);
  }
})
export default router2;
