// @desc   Get user
// @route  GET /api/user/:id
// @access Private
export const getUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get user ${req.params.id}` });
};
// @desc   Update user
// @route  PUT /api/user/:id
// @access Private
export const updateUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update user ${req.params.id}` });
};
// @desc   Delete user
// @route  DELETE /api/user/:id
// @access Private
export const deleteUser = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete user ${req.params.id}` });
};