const express = require("express");
const multer = require("multer");
const { extractTextFromFile } = require("../controllers/fileController");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError =
      "Invalid file type. Only PDFs, PNG, and JPEG are allowed.";
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

router.post("/extract-text", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    extractTextFromFile(req, res);
  });
});

module.exports = router;
