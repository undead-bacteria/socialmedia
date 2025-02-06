const AuthService = require("../services/auth.service");

const createUser = async (req, res) => {
  const body = req.body;
  try {
    const response = await AuthService.createUser(body);

    if (!response.success) {
      return res.status(400).json({ message: response.message });
    } else {
      return res
        .status(201)
        .json({ message: response.message, user: response.user });
    }
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An unexpected error occurred" });
  }
};

const loginUser = async (req, res) => {
  const body = req.body;

  try {
    const response = await AuthService.loginUser(body);

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json(response);
    }
  } catch (error) {
    console.log("Error during user registration:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while registering user",
    });
  }
};

const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res
      .status(400)
      .json({ success: false, message: "ID Token is required" });
  }

  const result = await AuthService.googleLogin(idToken);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};

module.exports = { createUser, loginUser, googleLogin };
