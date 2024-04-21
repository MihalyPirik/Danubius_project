const {
  createUser,
  loginUser
} = require("../controllers/authController");

const AuthRouter = require('express').Router();

AuthRouter.route("/registration").post(createUser);
AuthRouter.route("/login").post(loginUser);

module.exports = AuthRouter;