import jwt from 'jsonwebtoken';

import { ErrorResponse } from '../utils/errorResponse.js';
import UserModel from '../models/UserModel.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    };

    if (!token) {
      return next(new ErrorResponse('Nincs jogosultságod ehhez az útvonalhoz!', 401));
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await UserModel.findById(decoded.id);

    next();
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

// jogosultságok kezelése
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`A ${req.user.role} jogosultságod nem elégséges ehhez a művelethez!`, 403));
    };
    next();
  };
};