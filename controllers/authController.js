import UserModel from "../models/UserModel.js";

// @desc   Create new user
// @route  Post /api/auth/registration
// @access Public
export const createUser = async (req, res, next) => {
  try {
    const {name, email, password, role} = req.body;

    const user = await UserModel.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({ success: true});
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  };
};
// @desc   Login user
// @route  Post /api/auth/login
// @access Public
export const loginUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Login successful.` });
};