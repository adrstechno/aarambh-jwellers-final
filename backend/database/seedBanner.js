import mongoose from "mongoose";
import dotenv from "dotenv";
import Banner from "./models/Banner.js";

dotenv.config();

const seedBanners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Clear old banners
    await Banner.deleteMany();

    // Sample banners
    const banners = [
      {
        title: "RAKHI GIFTS",
        subtitle: "Celebrate the bond that can never be broken",
        image: "https://tulsyanjewellery.com/wp-content/uploads/2022/01/A5147-compressed-scaled.jpg",
        link: "/category/rakhi",
        order: 1,
        active: true,
      },
      {
        title: "SILVER COLLECTION",
        subtitle: "Timeless elegance with a modern touch",
        image: "https://www.jcsjewellers.com/cdn/shop/collections/Silver-Necklace_1920x.jpg?v=1657794949",
        link: "/category/silver",
        order: 2,
        active: true,
      },
      {
        title: "WEDDING SPECIALS",
        subtitle: "Crafted to make every moment unforgettable",
        image: "https://choodabazar.com/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-02-at-15.15.541.jpeg",
        link: "/category/wedding",
        order: 3,
        active: true,
      },
    ];

    await Banner.insertMany(banners);

    console.log("✅ Banners seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding banners:", err);
    process.exit(1);
  }
};

seedBanners();
