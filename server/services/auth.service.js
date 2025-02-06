const admin = require("../config/firebaseConfig");
const User = require("../models/user.model");

const createUser = async (body) => {
  try {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(body.email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        userRecord = await admin.auth().createUser({
          email: body.email,
          displayName: body.name,
        });
        console.log("New user created in Firebase Authentication.");
      } else {
        throw error;
      }
    }

    let newUser = await User.findOne({ email: body.email });

    if (!newUser) {
      newUser = new User({
        email: body.email,
        name: body.name,
        avatar: body.avatar,
        firebaseUid: userRecord.uid,
      });

      await newUser.save();
      console.log("New user saved to the database.");
    }

    return {
      success: true,
      message: "User created successfully",
      user: {
        email: userRecord.email,
        displayName: userRecord.displayName,
        uid: userRecord.uid,
      },
    };
  } catch (error) {
    console.log("Error in user creation:", error);
    return {
      success: false,
      message: error.message || "An error occurred while creating the user",
    };
  }
};

const loginUser = async (body) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(body.email);

    const idToken = await admin.auth().createCustomToken(userRecord.uid);

    return {
      success: true,
      message: "Login successful",
      user: {
        name: userRecord.displayName,
        email: userRecord.email,
        uid: userRecord.uid,
      },
      token: idToken,
    };
  } catch (error) {
    console.log("Error:", error);
    return {
      success: false,
      message: "An error occurred while logging in",
    };
  }
};

const googleLogin = async (idToken) => {
  try {
    const decodedUser = await admin.auth().verifyIdToken(idToken);

    const email = decodedUser.email;
    const name = decodedUser.name || email.split("@")[0];
    const profileImage = decodedUser.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        profileImage,
      });
      await user.save();
    }

    return {
      success: true,
      message: "Google login successful",
      user: {
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        description: user.description,
        location: user.location,
      },
    };
  } catch (error) {
    console.log("Google login error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during Google login",
    };
  }
};

module.exports = { createUser, loginUser, googleLogin };
