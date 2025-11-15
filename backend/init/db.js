import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/E-Commerce")

  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
    process.exit(1);
  }
};

export default connectDB;