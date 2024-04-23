// @desc   Get all books
// @route  GET /api/books
// @access Public
export const getBooks = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all books' });
};
// @desc   Get single book
// @route  GET /api/books/:id
// @access Public
export const getBook = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Get book ${req.params.id}` });
};
// @desc   Create new book
// @route  POST /api/books
// @access Private
export const createBook = (req, res, next) => {
  res.status(201).json({ success: true, msg: 'Create new book' });
};
// @desc   Update book
// @route  PUT /api/books/:id
// @access Private
export const updateBook = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update book ${req.params.id}` });
};
// @desc   Delete book
// @route  DELETE /api/books/:id
// @access Private
export const deleteBook = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete book ${req.params.id}` });
};
