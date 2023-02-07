import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
    },
    stars:{
        type:Number,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }
})

export const Review = mongoose.model('Review', ReviewSchema);