// @desc   Get user
// @route  GET /api/user/:id
// @access Private
const getUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get user ${req.params.id}` });
};
// @desc   Update user
// @route  PUT /api/user/:id
// @access Private
const updateUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update user ${req.params.id}` });
};
// @desc   Delete user
// @route  DELETE /api/user/:id
// @access Private
const deleteUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete user ${req.params.id}` });
};

module.exports = {
  getUser,
  updateUser,
  deleteUser
};