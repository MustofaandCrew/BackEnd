const multer = require("multer");
const path = require("path");

const publicDirectory = path.join(__dirname, "../public");
const uploadDirectory = path.join(publicDirectory, "uploads");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, res, cb) => {
    const uniqueSuffix = Date.now() + path.extname(res.originalname);
    cb(null, uniqueSuffix);
  },
});

module.exports = multer({ storage });
