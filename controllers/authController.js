import UserModel from '../models/UserModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { tokenVerify } from './bookController.js';

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

    sendTokenResponse(user, 201, res);
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

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Érvénytelen email cím vagy jelszó!', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
// @desc   Logout user / cookie delete
// @route  GET /api/auth/logout
// @access Private
export const logoutUser = async (req, res, next) => {
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  };
};

export const sendTokenResponse = (user, statusCode, res) => {
  try {
    const token = user.getSignedToken();

    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true
    };

    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};