import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    required: true,
  },
  color: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  featuredProduct:{
    type: Boolean,
    default:false
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Review',
    }
  ]
});

export const Product = mongoose.model("Product", ProductSchema);
