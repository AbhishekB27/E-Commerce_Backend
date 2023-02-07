import express from "express";
import { body, validationResult } from "express-validator";
import isAuthenticated from "../middlewares/isAuthenticated";
import { Product } from "../services/mongoDB/models/Product";
import { Review } from "../services/mongoDB/models/Review";
const router4 = express.Router();
let message = {
  status: false,
  data: null,
  message: null,
};

//add a review of a product
router4.post(
  "/add",
  isAuthenticated,
  body("description")
    .isLength({ max: 250 })
    .withMessage("Please Reduce the description length"),
  body("stars").isNumeric().withMessage("Please Rate it"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      message = {
        success: false,
        data: null,
        message: errors.array()[0].msg,
      };
      return res.status(400).json(message);
    }
    try {
      const newReview = new Review({ ...req.body });
      await newReview.save();
      const populateReview = await Review.findOne({_id:newReview._id}).populate({
        path:'user',
        select:['avtar','userName']
      });
      if (newReview) {
        const updateProduct = await Product.findOneAndUpdate(
          { _id: newReview.product },
          { $push: { reviews: newReview._id } }
        );
        if (updateProduct) {
          message = {
            success: true,
            data: populateReview,
            message: "Successfully Added Review😊",
          };
          return res.status(200).json(message);
        }
      }
    } catch (error) {
      console.log(error.message);
      message = {
        success: false,
        data: null,
        message: error.message,
      };
      return res.status(400).json(message);
    }
  }
);

// getAllReview
router4.get("/getReviews", async (req, res) => {
  try {
    const reviews = await Review.find().populate({
      path:'user',
      select:['avtar','userName']
    });
    message = {
      success: true,
      data: reviews,
      message: "Success",
    };
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
    message = {
      success: false,
      data: null,
      message: error.message,
    };
    return res.status(400).json(message);
  }
})
//getReviewByProductId or fetchReview according to particular product
router4.get("/review/:pId", async (req, res) => {
  const { pId } = req.params;
  try {
    const review = await Review.find({product:pId}).populate({
      path:'user',
      select:['avtar','userName']
    });;
    message = {
      success: true,
      data: review,
      message: 'Success',
    };
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
    message = {
      success: false,
      data: null,
      message: error.message,
    };
    return res.status(400).json(message);
  }
});

//update review
router4.put('/review/:rId',isAuthenticated,async(req,res)=>{
  try {
    const {rId} = req.params
    const updateReview = await Review.findOneAndUpdate({_id: rId},{...req.body},{new:true}).populate({
      path:'user',
      select:['avtar','userName']
    });
    message = {
      success: true,
      data: updateReview,
      message: "Updated😊",
    };
    return res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
    message = {
      success: false,
      data: null,
      message: error.message,
    };
    return res.status(400).json(message);
  }
})
export default router4;
