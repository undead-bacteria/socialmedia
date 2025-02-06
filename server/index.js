const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

// Database import
const connectDB = require("./config/db");
connectDB();

// Middleware import
const { errorHandler, logger } = require("./middlewares/main");

// Cors Setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(logger);

// Routes
const route = require("./routes/routes");
route(app);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
