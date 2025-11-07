import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./init/db.js"
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

dotenv.config();
connectDB(); // Database connection

const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/checkout", checkoutRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server is runninng on port ${PORT}`);
});

