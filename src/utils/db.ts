import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/env";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to database | Host: ${res.connection.host}`);
  } catch (error) {
    console.log("Error in connecting database", error);
    process.exit(1);
  }
};

export default connectDB;
