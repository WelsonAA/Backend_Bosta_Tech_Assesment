function notFound(req, res, next) {
  res.status(404).json({ error: "Not Found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ error: err.message || "Error" });
}

module.exports = { notFound, errorHandler };
