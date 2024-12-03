module.exports = (app) => {
  app.use("/auth", require("./auth.route"));
  app.use("/user", require("./user.route"));
};
