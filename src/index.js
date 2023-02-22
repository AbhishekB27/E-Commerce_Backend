import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import addressRoute from "./routes/addressRoute";
import productRoute from "./routes/productRoute";
import reviewRoute from "./routes/reviewRoute";
import stripeRoute from "./routes/stripeCheckout";
import ordersRoute from "./routes/ordersRoute";
import connectDB from "./services/mongoDB/connectDB";

const app = express();
app.use(cors());
app.use(express.json()); // Body parser middleware
dotenv.config("../.env");
connectDB();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/orders", ordersRoute);

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
