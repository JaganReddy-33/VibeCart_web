import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ✅ Checkout Controller
export const checkout = async (req, res) => {
  try {
    const { cartItems, name, email } = req.body;

    // Validation
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Optional: update stock (if needed)
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (product && product.stock >= item.qty) {
        product.stock -= item.qty;
        await product.save();
      }
    }

    // Create order record
    const order = new Order({
      customer: { name, email },
      items: cartItems.map((i) => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      totalAmount,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "✅ Checkout successful",
      orderId: order._id,
      total: totalAmount,
      customer: { name, email },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
