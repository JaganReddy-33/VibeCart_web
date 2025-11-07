import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  // Make first user or special email admin
  const isAdmin = email === "admin@shop.com";

  const user = new User({ name, email, password: hashed, isAdmin });
  await user.save();

  res.json({ message: "User registered successfully", isAdmin });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" }
  );

  res.json({ token, isAdmin: user.isAdmin, name: user.name, email: user.email });
};
