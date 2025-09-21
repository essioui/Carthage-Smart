const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addDailyConsumption,
  getAllData,
} = require("../controllers/dailyController");
const validateContactToken = require("../middlewares/validateTokenHandler");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.use(validateContactToken);

router.post("/daily", upload.single("file"), addDailyConsumption);

router.get("/daily/export", getAllData);

module.exports = router;
