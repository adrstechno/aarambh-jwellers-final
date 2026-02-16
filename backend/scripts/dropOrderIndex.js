// backend/scripts/fixUserCollection.js
import mongoose from "mongoose";

// 👉 Your Atlas connection
const MONGO_URI =
  "mongodb+srv://kharepiyushpk:piyush2382000@cluster1.etjiprc.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster1";

(async () => {
  try {
    console.log("🔗 Connecting to MongoDB (test DB)...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully!");

    const db = mongoose.connection.db;
    const users = db.collection("users");

    /* =====================================================
       1️⃣  CLEAN EXISTING DATA
    ===================================================== */
    console.log("\n🧹 Cleaning existing null email/phone fields...");
    const cleanRes = await users.updateMany(
      { $or: [{ email: null }, { phone: null }] },
      { $unset: { email: "", phone: "" } }
    );
    console.log(`✅ Cleaned ${cleanRes.modifiedCount} user(s).`);

    /* =====================================================
       2️⃣  DROP & REBUILD INDEXES
    ===================================================== */
    const indexes = await users.listIndexes().toArray();
    console.log("\n📋 Existing indexes:");
    console.table(indexes.map((i) => i.name));

    for (const idx of indexes) {
      if (["email_1", "phone_1"].includes(idx.name)) {
        try {
          await users.dropIndex(idx.name);
          console.log(`🗑️ Dropped index: ${idx.name}`);
        } catch (err) {
          console.log(`⚠️ Could not drop ${idx.name}:`, err.message);
        }
      }
    }

    console.log("\n🔧 Creating proper sparse unique indexes...");
    await users.createIndex({ email: 1 }, { unique: true, sparse: true });
    await users.createIndex({ phone: 1 }, { unique: true, sparse: true });
    console.log("✅ Indexes rebuilt successfully!");

    const finalIndexes = await users.listIndexes().toArray();
    console.log("\n🧾 Final indexes:");
    console.table(
      finalIndexes.map((i) => ({
        name: i.name,
        unique: i.unique || false,
        sparse: i.sparse || false,
      }))
    );

    /* =====================================================
       3️⃣  VALIDATE FIX
    ===================================================== */
    const sample = await users.findOne({}, { projection: { email: 1, phone: 1 } });
    console.log("\n🔍 Sample user (for sanity check):", sample);

    console.log("\n🎉 All done!");
    console.log(
      "✅ You can now safely register users with or without email/phone — no more duplicate null errors."
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing users collection:", err);
    process.exit(1);
  }
})();
