import mongoose from "mongoose";
import { hashedPassword } from "../../../uitls/password";

const UserSchema = new mongoose.Schema({
    role:{
        type: Number,
        default: 1,
    },
    avtar:{
        aName:{type:String, default:null},
        aURL:{type:String, default:null},
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    addresses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Address'
        }
    ]
})

UserSchema.pre('save', async function(next){
    try {
        const {password} = this
        if(password){
            this.password = await hashedPassword(password)
            next()
        }
        else{
            throw new Error("Failed to hashed Password")
        }
    } catch (error) {
        throw new Error(error.message)
    }
})
export const User = mongoose.model('User',UserSchema)