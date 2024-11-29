const { STATUS_CODES } = require("http");

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  if (["ValidationError", "UserExistsError"].includes(err.name)) {
    return res.status(400).json({ error: err.message || "Bad Request" });
  }

  if (process.env.NODE_ENV !== "development") {
    console.error("[error] API error", { error: err });
  }

  return res.status(err.status || 500).json({
    message: err.message || STATUS_CODES[err.status] || "Internal Server Error",
  });
};

module.exports = { errorHandler };
