import Banner from "./models/Banner.js";

// @desc Get all active banners (sorted by order)
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};

// @desc Get single banner by ID
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

// @desc Create new banner
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, image, link, order, active } = req.body;
    const banner = await Banner.create({
      title,
      subtitle,
      image,
      link,
      order,
      active,
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to create banner" });
  }
};

// @desc Update banner
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to update banner" });
  }
};

// @desc Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner" });
  }
};
