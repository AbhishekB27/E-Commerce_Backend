import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    houseNumber:{
        type:String,
        required:true
    },
    areaName:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['home','work'],
        default:'Home'
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

export const Address = mongoose.model('Address',AddressSchema)