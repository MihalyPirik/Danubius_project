// @desc   Create new user
// @route  Post /api/auth/registration
// @access Public
export const createUser = (req, res, next) => {
  res.status(201).json({ success: true, msg: `Registration successful.` });
};
// @desc   Login user
// @route  Post /api/auth/login
// @access Public
export const loginUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Login successful.` });
};