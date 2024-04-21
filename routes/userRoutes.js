const {
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const UserRouter = require('express').Router();

UserRouter
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = UserRouter;
