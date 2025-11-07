// cleanupUsers.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const cleanup = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const users = db.collection("users");

    // 1️⃣ Drop all indexes
    console.log("🧩 Dropping ALL indexes...");
    try {
      await users.dropIndexes();
      console.log("   ✔ All indexes dropped successfully");
    } catch {
      console.log("   ⚠️ No indexes found");
    }

    // 2️⃣ Remove duplicates and invalid values for email & phone
    console.log("🧹 Cleaning null, missing, and empty values...");

    // Remove explicit empty strings
    await users.updateMany({ email: "" }, { $unset: { email: "" } });
    await users.updateMany({ phone: "" }, { $unset: { phone: "" } });

    // Delete users with duplicate or null emails
    const nullEmails = await users.find({ email: null }).toArray();
    if (nullEmails.length > 1) {
      await users.deleteMany({ email: null });
      console.log(`   🗑 Deleted ${nullEmails.length} users with email: null`);
    }

    const missingEmail = await users.find({ email: { $exists: false } }).toArray();
    if (missingEmail.length > 1) {
      await users.deleteMany({ email: { $exists: false } });
      console.log(`   🗑 Deleted ${missingEmail.length} users missing email`);
    }

    // Delete users with duplicate or null phones
    const nullPhones = await users.find({ phone: null }).toArray();
    if (nullPhones.length > 1) {
      await users.deleteMany({ phone: null });
      console.log(`   🗑 Deleted ${nullPhones.length} users with phone: null`);
    }

    const missingPhones = await users.find({ phone: { $exists: false } }).toArray();
    if (missingPhones.length > 1) {
      await users.deleteMany({ phone: { $exists: false } });
      console.log(`   🗑 Deleted ${missingPhones.length} users missing phone`);
    }

    console.log("   ✔ All invalid/null values cleaned");

    // 3️⃣ Remove any leftover duplicates
    const dedup = async (field) => {
      const duplicates = await users
        .aggregate([
          { $group: { _id: `$${field}`, ids: { $push: "$_id" }, count: { $sum: 1 } } },
          { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
        ])
        .toArray();

      for (const dup of duplicates) {
        const [, ...toDelete] = dup.ids;
        await users.deleteMany({ _id: { $in: toDelete } });
        console.log(`   🗑 Removed duplicates for ${field}: ${dup._id}`);
      }
    };

    await dedup("email");
    await dedup("phone");

    // 4️⃣ Recreate indexes safely
    console.log("🔧 Recreating sparse unique indexes...");
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    await users.createIndex({ phone: 1 }, { unique: true, sparse: true });

    console.log("✅ FIX COMPLETE — register/login now works with email or phone!");
  } catch (err) {
    console.error("❌ Cleanup error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

cleanup();
