import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Find categories
    const necklaceCat = await Category.findOne({ slug: "necklace" });
    const ringsCat = await Category.findOne({ slug: "rings" });
    const braceletsCat = await Category.findOne({ slug: "bracelets" });

    await Product.deleteMany();

    const products = [
      {
        name: "Elegant Diamond Necklace",
        slug: "diamond-necklace",
        description: "A beautifully crafted diamond necklace.",
        price: 15000,
        stock: 10,
        category: necklaceCat._id,
        images: [
          "https://images.pexels.com/photos/1125328/pexels-photo-1125328.jpeg?auto=compress&cs=tinysrgb&w=400",
        ],
        isFeatured: true,
      },
      {
        name: "Gold Ring",
        slug: "gold-ring",
        description: "Classic 22k gold ring.",
        price: 8000,
        stock: 20,
        category: ringsCat._id,
        images: [
          "https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=400",
        ],
        isFeatured: true,
      },
      {
        name: "Silver Bracelet",
        slug: "silver-bracelet",
        description: "Elegant silver bracelet for daily wear.",
        price: 5000,
        stock: 15,
        category: braceletsCat._id,
        images: [
          "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400",
        ],
        isFeatured: true,
      },
    ];

    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
