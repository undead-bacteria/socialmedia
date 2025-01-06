module.exports = (app) => {
  app.use("/api/auth", require("./auth.route"));
  app.use("/api/user", require("./user.route"));
  app.use("/api/post", require("./post.route"));
  app.use("/api/comment", require("./comment.route"));
  app.use("/api/notification", require("./notification.route"));
};
