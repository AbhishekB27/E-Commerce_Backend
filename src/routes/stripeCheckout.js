import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Order } from "../services/mongoDB/models/Order";

const router5 = express.Router();
// message object
let message = {
  success: false,
  data: null,
  message: "",
};
dotenv.config("../.env");
const stripe = Stripe(process.env.STRIPE_KEY);
router5.post("/create-checkout-session", async (req, res) => {
  const { cartItems, uId } = req.body;
  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "INR",
        product_data: {
          name: item.productName,
          images:[item.imageURL]
        },
        unit_amount: item.price * 100, // here we multiply it by 100 because stripe observe amount in paise
      },
      quantity: item.quantity,
    };
  });
  try {
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ["IN"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "INR" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 99900, currency: "INR" },
            display_name: "Same Day Courier",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items,
      metadata: {
        userId: uId,
        items: JSON.stringify(cartItems),
      },
      mode: "payment",
      success_url: "http://localhost:3000/checkout-success",
      cancel_url: "http://localhost:3000/checkout-cancel",
      billing_address_collection: "required",
    });
    message = {
      success: true,
      data: session,
      message: "Success",
    };
    return res.send(message);
  } catch (error) {
    console.log(error.message);
    message = {
      success: false,
      data: null,
      message: "Failed",
    };
    return res.send(message);
  }
});
router5.post("/webhook", async (req, res) => {
  // const endpointSecret = "whsec_7244b7f8c2d319c23c7a48e4d6ecd03db3e2bc48f8bdc9a573f6625d088894af";
  // const sig = req.headers['stripe-signature'];
  const payloadString = JSON.stringify(req.body, null, 2);
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });
  let event;
  try {
    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (err) {
    console.log("Webhook Error: " + err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    try {
      const paymentIntent = event.data.object;
      const newOrder = new Order({
        customerId: paymentIntent.metadata.userId,
        paymentIntentId: paymentIntent.payment_intent,
        products: JSON.parse(paymentIntent.metadata.items),
        subTotal: paymentIntent.amount_subtotal,
        total: paymentIntent.amount_total,
        shippingInfo: paymentIntent.customer_details,
        paymentStatus: paymentIntent.payment_status,
      });
      await newOrder.save();
      // Return a 200 response to acknowledge receipt of the event
      res.status(200).send().end();
    } catch (error) {
      console.error(error.message);
    }
  }
  console.log("Event: " + event.type);
});
export default router5;
