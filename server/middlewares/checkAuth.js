const admin = require("../config/firebaseConfig");

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    req.user = decodedValue;
    next();
  } catch (e) {
    console.log("Error verifying token:", e);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { checkAuth };
