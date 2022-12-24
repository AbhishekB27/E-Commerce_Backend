import mongoose from "mongoose";
const connectDB = () => {
  const MONGO_URL = process.env.MONGO_URL;
  mongoose
    .connect(MONGO_URL, {})
    .then(() => console.log("Mongoose Connected Successfully"))
    .catch((err) => console.log(err));
};
export default connectDB;
