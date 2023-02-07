import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    addressTitle:{
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
    country:{
        type:String,
        required:true,
    },
    zip:{
        type:Number,
        required:true,
    },
    addressType:{
        type:String,
        enum:['home','office'],
        default:'home'
    },
    contactNumber:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

export const Address = mongoose.model('Address',AddressSchema)