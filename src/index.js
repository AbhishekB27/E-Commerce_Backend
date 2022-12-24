import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute";
import connectDB from "./services/mongoDB/connectDB";

const app = express();
app.use(cors());
app.use(express.json()); // Body parser middleware
dotenv.config("../.env");
connectDB();
const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoute);
app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
