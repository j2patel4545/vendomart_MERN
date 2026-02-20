import User from "../models/User.js";

export const uploadProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { profileImage: req.file.path },
    { new: true }
  );
  res.json(user);
};
