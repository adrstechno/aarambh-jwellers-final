import Wishlist from "../models/wishlist.js";


const fixImagePath = (image) => {
  if (!image) return null;

  const cleanPath = image.replace(/\\/g, "/"); // normalize backslashes
  if (cleanPath.startsWith("http")) return cleanPath;

  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/")
    ? `${base}${cleanPath}`
    : `${base}/${cleanPath}`;
};

// ✅ Normalize product images in wishlist - OPTIMIZED
const normalizeWishlistImages = (wishlist) => {
  if (!wishlist || !wishlist.products) return wishlist;
  return {
    ...(wishlist._doc || wishlist),
    products: wishlist.products.map((p) => ({
      ...(p._doc || p),
      product: {
        ...(p.product._doc || p.product),
        image: fixImagePath(p.product.image),
      },
    })),
  };
};

// ✅ Get wishlist - OPTIMIZED with lean()
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: "products.product",
        select: "name price image images slug category stock",
      })
      .select("products createdAt");

    if (!wishlist) return res.json({ products: [], total: 0 });

    const normalized = normalizeWishlistImages(wishlist);
    
    // ✅ Set cache headers
    res.set("Cache-Control", "private, max-age=300"); // 5 minutes
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error fetching wishlist:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// ✅ Add to wishlist - OPTIMIZED
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
    const updated = await wishlist.populate({
      path: "products.product",
      select: "name price image images slug category stock",
    });

    const normalized = normalizeWishlistImages(updated);
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error adding to wishlist:", err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// ✅ Remove from wishlist - OPTIMIZED
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
    const updated = await wishlist.populate({
      path: "products.product",
      select: "name price image images slug category stock",
    });

    const normalized = normalizeWishlistImages(updated);
    res.status(200).json(normalized);
  } catch (err) {
    console.error("❌ Error removing from wishlist:", err);
    res.status(500).json({ message: "Failed to remove product" });
  }
};
