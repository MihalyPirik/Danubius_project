import UserModel from '../models/UserModel.js';
import BookModel from '../models/BookModel.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { tokenVerify } from './bookController.js';
import { sendTokenResponse } from './authController.js';

// @desc   Get user
// @route  GET /api/user/:id
// @access Private
export const getUser = async (req, res, next) => {
  // #swagger.tags = ['Felhasználók']
  // #swagger.summary = 'Egy felhasználó lekérése.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('Nincs ilyen felhasználó!', 400));
    };

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
// @desc   Get user books
// @route  GET /api/user/:id/books
// @access Private
export const getUserBooks = async (req, res, next) => {
  // #swagger.tags = ['Felhasználók']
  // #swagger.summary = 'Felhasználó könyvei.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('Nincs ilyen felhasználó!', 400));
    };

    const books = await BookModel.find({ user: user._id });

    if (books.length !== 0) {
      res.status(200).json({ success: true, count: books.length, data: books });
    } else {
      return next(new ErrorResponse(`Ennek a felhasználónak (${req.params.id}) nincsen könyve az adatbázisban!`, 404));
    };
  } catch (error) {
    next(error);
  }
};
// @desc   Update user
// @route  PUT /api/user/:id
// @access Private
export const updateUser = async (req, res, next) => {
  // #swagger.tags = ['Felhasználók']
  // #swagger.summary = 'Felhasználó adatainak a módosítása.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    const userCheck = await UserModel.findById(req.params.id);
    if (!userCheck) {
      return next(new ErrorResponse('Nincs ilyen felhasználó!', 400));
    };

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await UserModel.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
// @desc   Update user password
// @route  PUT /api/user/password:id
// @access Private
export const updatePassword = async (req, res, next) => {
  // #swagger.tags = ['Felhasználók']
  // #swagger.summary = 'Felhasználó jelszavának a módosítása.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    const user = await UserModel.findById(req.params.id).select('+password');
    if (!user) {
      return next(new ErrorResponse('Nincs ilyen felhasználó!', 400));
    };

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('A jelszó helytelen!', 401));
    };

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
// @desc   Delete user
// @route  DELETE /api/user/:id
// @access Private
export const deleteUser = async (req, res, next) => {
  // #swagger.tags = ['Felhasználók']
  // #swagger.summary = 'Felhasználó törlése.'
  try {
    const decoded = tokenVerify(req.headers.authorization.split(' ')[1]);
    if (req.params.id !== decoded.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Nincs jogosultságod erre!', 401));
    };

    const user = await UserModel.findById(req.params.id).select('+password');;
    if (!user) {
      return next(new ErrorResponse('Nincs ilyen felhasználó!', 400));
    };

    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  };
};