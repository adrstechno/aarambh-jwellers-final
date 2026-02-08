import Cart from "../models/cart.js";
import Product from "../models/product.js";

/* =======================================================
   🟢 GET CART - OPTIMIZED
======================================================= */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🚫 Prevent invalid/missing userId
    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name price image images stock" // Only select needed fields
      });

    if (!cart) return res.json({ items: [], total: 0 });

    // ✅ Set cache headers
    res.set("Cache-Control", "private, max-age=300"); // 5 minutes
    res.status(200).json(cart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

/* =======================================================
   🟡 ADD TO CART - OPTIMIZED
======================================================= */
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 🚫 Validation checks
    if (!userId || userId === "undefined")
      return res.status(400).json({ message: "Invalid user ID" });

    if (!productId || !quantity)
      return res.status(400).json({ message: "Missing product or quantity" });

    // ✅ Use lean() for read-only query
    const product = await Product.findById(productId).lean();
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
    const updated = await cart.populate({
      path: "items.product",
      select: "name price image images stock"
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ message: "Failed to add to cart", error: err.message });
  }
};

/* =======================================================
   🟠 UPDATE QUANTITY - OPTIMIZED
======================================================= */
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || userId === "undefined")
      return res.status(400).json({ message: "Invalid user ID" });

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name price image images stock"
      });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product._id.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    const updated = await cart.populate({
      path: "items.product",
      select: "name price image images stock"
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating quantity:", err);
    res.status(500).json({ message: "Failed to update quantity", error: err.message });
  }
};

/* =======================================================
   🔴 REMOVE ITEM - OPTIMIZED
======================================================= */
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || userId === "undefined")
      return res.status(400).json({ message: "Invalid user ID" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    const updated = await cart.populate({
      path: "items.product",
      select: "name price image images stock"
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error removing item:", err);
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
};

/* =======================================================
   ⚫ CLEAR CART - OPTIMIZED
======================================================= */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || userId === "undefined")
      return res.status(400).json({ message: "Invalid user ID" });

    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};
