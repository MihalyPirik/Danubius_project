const express = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router;
