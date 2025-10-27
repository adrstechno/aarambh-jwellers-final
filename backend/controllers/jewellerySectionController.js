import JewellerySection from "../models/jewellerySection.js";

// 🟢 Get active section (for frontend)
export const getJewellerySection = async (req, res) => {
  try {
    const section = await JewellerySection.findOne().sort({ createdAt: -1 });

    // 🟢 Return an empty object instead of 404 so frontend loads gracefully
    if (!section) {
      return res.status(200).json({
        title: "",
        subtitle: "",
        tagline: "",
        description: "",
        button1Text: "Shop Now",
        button1Link: "/products",
        button2Text: "View More",
        button2Link: "/about",
        mainImage: "",
        modelImage: "",
        status: "Active",
      });
    }

    res.status(200).json(section);
  } catch (err) {
    console.error("❌ Error fetching jewellery section:", err);
    res.status(500).json({ message: "Failed to fetch section" });
  }
};


// 🟡 Admin: create/update section
export const upsertJewellerySection = async (req, res) => {
  try {
    const data = req.body;
    const imagePaths = {};
    if (req.files?.mainImage)
      imagePaths.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    if (req.files?.modelImage)
      imagePaths.modelImage = `/uploads/${req.files.modelImage[0].filename}`;

    const updated = await JewellerySection.findOneAndUpdate(
      {},
      { ...data, ...imagePaths },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "✅ Jewellery section updated successfully",
      section: updated,
    });
  } catch (err) {
    console.error("❌ Error saving section:", err);
    res.status(500).json({ message: "Failed to save section" });
  }
};
