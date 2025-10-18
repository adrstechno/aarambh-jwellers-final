import Wishlist from "../models/wishlist.js";

/* ======================================================
   🧠 Helper — Fix Image URLs for Products
====================================================== */
const fixImagePath = (image) => {
  if (!image) return null;

  const cleanPath = image.replace(/\\/g, "/"); // normalize backslashes
  if (cleanPath.startsWith("http")) return cleanPath;

  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/")
    ? `${base}${cleanPath}`
    : `${base}/${cleanPath}`;
};

// 🧩 Normalize product images in wishlist
const normalizeWishlistImages = (wishlist) => {
  if (!wishlist || !wishlist.products) return wishlist;
  return {
    ...wishlist._doc,
    products: wishlist.products.map((p) => ({
      ...p._doc,
      product: {
        ...p.product._doc,
        image: fixImagePath(p.product.image),
      },
    })),
  };
};

/* ======================================================
   🟢 Get Wishlist
====================================================== */
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products.product");
    if (!wishlist) return res.json({ products: [] });

    const normalized = normalizeWishlistImages(wishlist);
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

/* ======================================================
   🟡 Add Product to Wishlist
====================================================== */
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

    const normalized = normalizeWishlistImages(updated);
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

/* ======================================================
   🔴 Remove Product from Wishlist
====================================================== */
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

    const normalized = normalizeWishlistImages(updated);
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error removing from wishlist:", err);
    res.status(500).json({ message: "Failed to remove product" });
  }
};
