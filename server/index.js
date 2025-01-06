const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

// Middleware import
const { errorHandler, logger } = require("./middlewares/main");

// Database import
const connectDB = require("./config/db");

// Cors Setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(logger);
app.use(errorHandler);

// Routes import
const route = require("./routes/routes");
route(app);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
