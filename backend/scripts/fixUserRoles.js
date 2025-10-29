import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const fixUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    let count = 0;

    for (let user of users) {
      let updated = false;

      // normalize role
      if (user.role) {
        const r = user.role.toLowerCase();
        if (["admin", "customer"].includes(r)) {
          if (user.role !== r) {
            user.role = r;
            updated = true;
          }
        } else {
          console.warn(`⚠️ Invalid role "${user.role}" found → setting to "customer"`);
          user.role = "customer";
          updated = true;
        }
      } else {
        user.role = "customer";
        updated = true;
      }

      // normalize status
      if (user.status) {
        const s = user.status.toLowerCase();
        if (["active", "blocked"].includes(s)) {
          if (user.status !== s) {
            user.status = s;
            updated = true;
          }
        } else {
          console.warn(`⚠️ Invalid status "${user.status}" found → setting to "active"`);
          user.status = "active";
          updated = true;
        }
      } else {
        user.status = "active";
        updated = true;
      }

      if (updated) {
        await user.save({ validateBeforeSave: false }); // ✅ skip enum validation
        count++;
      }
    }

    console.log(`✅ Updated ${count} users successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
};

fixUsers();
