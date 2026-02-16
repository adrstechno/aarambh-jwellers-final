// fixUserIndexes.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const runFix = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const users = db.collection("users");

    console.log("🧹 Cleaning empty emails and phones...");

    // Replace "" with null
    await users.updateMany({ email: "" }, { $set: { email: null } });
    await users.updateMany({ phone: "" }, { $set: { phone: null } });

    console.log("🔍 Checking for duplicate phone numbers...");

    // Group by phone and find duplicates
    const duplicates = await users
      .aggregate([
        { $match: { phone: { $ne: null } } },
        { $group: { _id: "$phone", count: { $sum: 1 }, ids: { $push: "$_id" } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();

    if (duplicates.length) {
      console.log(`⚠️ Found ${duplicates.length} duplicate phone numbers:`);
      duplicates.forEach((dup) =>
        console.log(`   📞 ${dup._id} → ${dup.count} users`)
      );

      console.log("🧽 Removing extra duplicate entries (keeping one each)...");
      for (const dup of duplicates) {
        const [, ...toDelete] = dup.ids; // skip the first one
        await users.deleteMany({ _id: { $in: toDelete } });
      }
    } else {
      console.log("✅ No duplicate phone numbers found.");
    }

    console.log("🧩 Dropping old indexes...");
    try {
      await users.dropIndex("email_1");
    } catch {
      console.log("⚠️ No existing email index found (skipping).");
    }
    try {
      await users.dropIndex("phone_1");
    } catch {
      console.log("⚠️ No existing phone index found (skipping).");
    }

    console.log("🔧 Recreating proper sparse unique indexes...");
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    await users.createIndex({ phone: 1 }, { unique: true, sparse: true });

    console.log("✅ Fix complete! You can now register via phone or email safely.");
  } catch (err) {
    console.error("❌ Error running fix:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

runFix();
