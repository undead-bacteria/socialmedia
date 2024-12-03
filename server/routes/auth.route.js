const { Router } = require("express");
const router = Router();

const AuthController = require("../controllers/auth.controller");

router.post("/login", AuthController.loginUser);
router.post("/register", AuthController.registerUser);

module.exports = router;
