import Cart from "../models/cart.js";
import Product from "../models/product.js";

// ✅ Get cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.json({ items: [], total: 0 });
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// ✅ Add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: product.price }],
        total: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }

    await cart.save();
    const updated = await cart.populate("items.product");
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// ✅ Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Error updating quantity:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

// ✅ Remove item
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    const updated = await cart.populate("items.product");
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error removing item:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// ✅ Clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
