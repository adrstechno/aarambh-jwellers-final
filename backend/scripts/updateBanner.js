import mongoose from "mongoose";
import dotenv from "dotenv";
import Banner from "../models/banner.js";

dotenv.config();

const updateBannerImage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // New banner image URL
    const newImageUrl = "https://res.cloudinary.com/dp2vawyj8/image/upload/v1771239639/aarambh-jwellers/banners/yuyabdpegozsrw2yqarw.png";

    // Find all banners
    const banners = await Banner.find();
    console.log(`\n📋 Found ${banners.length} banner(s):\n`);
    
    banners.forEach((banner, index) => {
      console.log(`${index + 1}. ID: ${banner._id}`);
      console.log(`   Title: ${banner.title}`);
      console.log(`   Current Image: ${banner.image}`);
      console.log(`   Active: ${banner.active}\n`);
    });

    if (banners.length === 0) {
      console.log("❌ No banners found. Creating a new banner...");
      
      const newBanner = new Banner({
        title: "Buy 925 Silver worth ₹2999 and get a free Gold Coin worth ₹999",
        subtitle: "Limited Time Offer",
        image: newImageUrl,
        link: "/category/silver",
        order: 0,
        active: true,
      });

      await newBanner.save();
      console.log("✅ New banner created successfully!");
      console.log(`   ID: ${newBanner._id}`);
      console.log(`   Image: ${newBanner.image}`);
    } else {
      // Update the first banner (or you can specify which one)
      const bannerToUpdate = banners[0];
      
      console.log(`🔄 Updating banner: ${bannerToUpdate._id}`);
      
      bannerToUpdate.image = newImageUrl;
      bannerToUpdate.title = "Buy 925 Silver worth ₹2999 and get a free Gold Coin worth ₹999";
      bannerToUpdate.subtitle = "Limited Time Offer";
      bannerToUpdate.link = "/category/silver";
      bannerToUpdate.active = true;
      
      await bannerToUpdate.save();
      
      console.log("✅ Banner updated successfully!");
      console.log(`   ID: ${bannerToUpdate._id}`);
      console.log(`   New Image: ${bannerToUpdate.image}`);
    }

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

updateBannerImage();
