import UserModel from "../models/UserModel.js";
import { ErrorResponse } from "../utils/errorResponse.js";

// @desc   Create new user
// @route  Post /api/auth/registration
// @access Public
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await UserModel.create({
      name,
      email,
      password,
      role
    });

    // token létrehozása
    const token = user.getSignedToken();

    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  };
};
// @desc   Login user
// @route  Post /api/auth/login
// @access Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Kérem adjon meg egy email címet és egy jelszót!', 400));
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Érvénytelen email cím vagy jelszó!', 401));
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return next(new ErrorResponse('Érvénytelen email cím vagy jelszó!', 401));
    }

    const token = user.getSignedToken();

    res.status(200).json({ success: true, token });

  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};