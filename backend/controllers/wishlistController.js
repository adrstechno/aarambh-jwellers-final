import Wishlist from "../models/wishlist.js";

// 🟢 Get wishlist for a user
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!wishlist) return res.json({ products: [] });
    res.status(200).json(wishlist);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// 🟡 Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [{ product: productId }] });
    } else {
      const exists = wishlist.products.some(
        (p) => p.product.toString() === productId
      );
      if (exists)
        return res.status(400).json({ message: "Product already in wishlist" });
      wishlist.products.push({ product: productId });
    }

    await wishlist.save();
    const updated = await wishlist.populate("products.product");
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// 🔴 Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId
    );

    await wishlist.save();
    const updated = await wishlist.populate("products.product");
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error removing from wishlist:", err);
    res.status(500).json({ message: "Failed to remove product" });
  }
};
