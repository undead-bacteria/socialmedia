const logger = (req, res, next) => {
  const url = req.url;

  res.on("finish", function () {
    const statusMessage = res.statusMessage || "-";
    console.log(
      `[log]: ${req.method} --- ${url} --- ${res.statusCode} ${res.statusMessage}`
    );
  });

  next();
};

module.exports = { logger };
