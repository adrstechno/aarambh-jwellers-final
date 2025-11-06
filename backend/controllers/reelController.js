// backend/controllers/reelController.js
import Reel from "../models/reel.js";

export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ order: 1 });
    res.status(200).json(reels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reels" });
  }
};

export const createReel = async (req, res) => {
  try {
    const { title, videoUrl, thumbnail } = req.body;

    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const newReel = await Reel.create({
      title,
      videoUrl: req.file ? req.file.path : videoUrl,
      thumbnail,
      order: await Reel.countDocuments(),
    });

    res.status(201).json(newReel);
  } catch (err) {
    console.error("❌ Error creating reel:", err);
    res.status(500).json({ message: "Failed to create reel" });
  }
};

export const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.videoUrl = req.file.path;

    const updatedReel = await Reel.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedReel);
  } catch (err) {
    res.status(500).json({ message: "Failed to update reel" });
  }
};

export const deleteReel = async (req, res) => {
  try {
    await Reel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reel" });
  }
};

export const reorderReels = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : req.body.reels;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format. Expected array." });
    }

    // Perform bulk updates
    await Promise.all(
      data.map((r) =>
        Reel.findByIdAndUpdate(r._id, { order: r.order })
      )
    );

    res.status(200).json({ message: "✅ Reels reordered successfully" });
  } catch (error) {
    console.error("❌ Error reordering reels:", error);
    res.status(500).json({ message: "Failed to reorder reels" });
  }
};
