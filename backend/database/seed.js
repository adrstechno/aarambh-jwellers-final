import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Pendants",
    slug: "pendants",
    image: "https://images.pexels.com/photos/1125328/pexels-photo-1125328.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Necklace",
    slug: "necklace",
    image: "https://images.pexels.com/photos/1125328/pexels-photo-1125328.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Payals",
    slug: "payals",
    image: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Watches",
    slug: "watches",
    image: "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  },
  {
    name: "Bangles",
    slug: "bangles",
    image: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected...");
    await Category.deleteMany();
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
    process.exit();
  })
  .catch((err) => console.error(err));
