import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customerId:{ type: mongoose.Schema.Types.ObjectId,ref:'User', required: true },
    paymentIntentId:{ type: String, required: true },
    products:[ { type:Object, required: true } ],
    shippingAmount:{ type: Number, required: true },
    subTotal:{ type: Number, required: true },
    total:{ type: Number, required: true },
    shippingInfo:{ type: Object, required: true },
    dileveryStatus:{ type: String, required: true, default:'pending' },
    paymentStatus:{ type: String, required:true}
},
{timestamps:true});
export const Order = mongoose.model('Order',OrderSchema)