module.exports = (app) => {
  app.use("/auth", require("./auth.route"));
  app.use("/user", require("./user.route"));
  app.use("/post", require("./post.route"));
  app.use("/comment", require("./comment.route"));
  app.use("/notification", require("./notification.route"));
};
