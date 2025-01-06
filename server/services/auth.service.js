const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (body) => {
  if (!body.email || !body.name || !body.password) {
    return {
      success: false,
      message: "Email, name and password are required",
    };
  }

  try {
    const user = await User.findOne({ email: body.email });
    if (user) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    // create the new user object
    const newUser = new User({
      email: body.email,
      name: body.name,
      password: hashedPassword,
    });
    await newUser.save();

    return { success: true, message: "User created successfully" };
  } catch (e) {
    console.log("Error:", e);
    return {
      success: false,
      message: "An error occurred while creating the user",
    };
  }
};

const loginUser = async (body) => {
  try {
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // compare password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    // generate a jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { success: true, message: "Login successful", token: token };
  } catch (error) {
    console.log("Error:", error);
    return {
      success: false,
      message: "An error occurred while logging in",
    };
  }
};

module.exports = { createUser, loginUser };
