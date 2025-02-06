const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

router.post("/login", AuthController.loginUser);
router.post("/signup", AuthController.createUser);
router.post("/google", AuthController.googleLogin);

module.exports = router;
