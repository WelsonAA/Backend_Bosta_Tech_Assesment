function errorHandler(err, req, res, next) {
  console.error(err); // log for debugging

  // Default status
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    status = 400;
    message = err.errors.map(e => e.message).join(", ");
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    status = 400;
    message = "Duplicate entry detected";
  }

  res.status(status).json({
    success: false,
    error: message
  });
}

module.exports = errorHandler;
