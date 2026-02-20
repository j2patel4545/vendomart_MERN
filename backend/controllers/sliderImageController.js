import SliderImage from "../models/SliderImage.js";

/* ================= CREATE ================= */
export const createSliderImage = async (req, res) => {
  try {
    const { productTypeId, sliderName, remark, status, homepage } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Slider image is required" });
    }

    const slider_image = `/${req.file.path.replace(/\\/g, "/")}`;

    const slider = await SliderImage.create({
      productTypeId,
      sliderName,
      slider_image,
      remark,
      status,
      homepage: homepage ? Number(homepage) : 0,
      createdBy: req.admin?._id,
    });

    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
export const getAllSliderImages = async (req, res) => {
  const data = await SliderImage.find()
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(data);
};

/* ================= GET BY ID ================= */
export const getSliderImageById = async (req, res) => {
  const slider = await SliderImage.findById(req.params.id).populate(
    "productTypeId",
    "productTypeName"
  );

  if (!slider) {
    return res.status(404).json({ message: "Slider not found" });
  }

  res.json(slider);
};

/* ================= GET BY HOMEPAGE ================= */
export const getHomepageSliders = async (req, res) => {
  try {
    const sliders = await SliderImage.find({ homepage: 1, status: true })
      .populate("productTypeId", "productTypeName")
      .sort({ createdAt: -1 });

    res.status(200).json(sliders);
  } catch (error) {
    console.error("Error fetching homepage sliders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET BY PRODUCT TYPE ================= */
export const getSlidersByProductType = async (req, res) => {
  const { productTypeId } = req.params;

  const sliders = await SliderImage.find({ productTypeId, status: true })
    .populate("productTypeId", "productTypeName")
    .sort({ createdAt: -1 });

  res.json(sliders);
};

/* ================= UPDATE ================= */
export const updateSliderImage = async (req, res) => {
  const slider = await SliderImage.findById(req.params.id);

  if (!slider) {
    return res.status(404).json({ message: "Slider not found" });
  }

  slider.productTypeId = req.body.productTypeId || slider.productTypeId;
  slider.sliderName = req.body.sliderName || slider.sliderName;
  slider.remark = req.body.remark || slider.remark;

  if (req.body.status !== undefined) {
    slider.status = req.body.status;
  }

  if (req.body.homepage !== undefined) {
    slider.homepage = Number(req.body.homepage); // 0 or 1
  }

  if (req.file) {
    slider.slider_image = `/${req.file.path.replace(/\\/g, "/")}`;
  }

  const updated = await slider.save();
  res.json(updated);
};

/* ================= DELETE ================= */
export const deleteSliderImage = async (req, res) => {
  await SliderImage.findByIdAndDelete(req.params.id);
  res.json({ message: "Slider deleted successfully" });
};

/* ================= STATUS TOGGLE ================= */
export const toggleSliderStatus = async (req, res) => {
  const slider = await SliderImage.findById(req.params.id);

  if (!slider) {
    return res.status(404).json({ message: "Slider not found" });
  }

  slider.status = !slider.status;
  await slider.save();

  res.json({
    message: "Status updated",
    status: slider.status,
  });
};
