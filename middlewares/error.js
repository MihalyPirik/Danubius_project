import { ErrorResponse } from '../utils/errorResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.log(err.stack); // a hibával kapcsolatos információk megjelenítése

  if (err.code === 11000) {
    const message = 'Duplicate field value';
    err = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};