import mongoose from "mongoose";
const connectDB = () => {
    const MONGO_URL = process.env.MONGO_URL;
    mongoose.connect(MONGO_URL)
    mongoose.connection.on('error',console.error.bind(console, 'Connection error'))
    mongoose.connection.once('open', () => console.log("Mongoose Connected Successfully"))
  
};
export default connectDB