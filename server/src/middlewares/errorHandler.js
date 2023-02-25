export default (err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
};
