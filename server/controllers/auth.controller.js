const AuthService = require("../services/auth.service");

const registerUser = async (req, res, next) => {
  const body = req.body;

  try {
    const response = await AuthService.createUser(body);

    if (response.success) {
      return res.status(201).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred" });
  }
};

const loginUser = async (req, res, next) => {
  const body = req.body;

  try {
    const response = await AuthService.loginUser(body);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred" });
  }
};

module.exports = { registerUser, loginUser };
