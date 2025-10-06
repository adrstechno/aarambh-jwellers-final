import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/jewelleryshop").then(async () => {
  try {
    await mongoose.connection.db.collection("orders").dropIndex("orderId_1");
    console.log("✅ Dropped duplicate orderId index successfully!");
  } catch (err) {
    console.error("⚠️ Could not drop index:", err.message);
  } finally {
    process.exit(0);
  }
});
