const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ isError: true, msg: err.message });
  }
  res.status(500).json({
    isError: true,
    msg: err.message
  });
};
export default errorHandler;
