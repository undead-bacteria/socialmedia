const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${fileExtension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPG, JPEG, PNG) are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

// middleware function to handle image uploads
const imageUpload = (req, res, next) => {
  // use multer upload instance
  upload.array("images")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.status(400).json({ error: err.message });
      }
    }

    if (
      (req.body.imageType === "profile" || req.body.imageType === "cover") &&
      req.files.length !== 0 &&
      req.files.length !== 1
    ) {
      return res.status(400).json({
        error: "Profile image should be exactly one file or no changes",
      });
    }
    next();
  });
};

module.exports = { imageUpload };
