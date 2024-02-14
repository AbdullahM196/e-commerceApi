/* eslint-disable no-unused-vars */
//1-not found
function NotFound(req, res, next) {
  const error = new Error(`NotFound ${req.originalURL}`);
  res.sendStatus(404);
  next(error);
}

//error handler
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name == "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
  } else if (err.name == "CastError" && err.kind) {
    statusCode = 404;
    message = "Resource Not Found";
  }
  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
}
module.exports = {
  NotFound,
  errorHandler,
};
