const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    registerContact,
    loginContactByFace,
    seeProfile
} = require("../controllers/contactAuthController");

const validateContactToken = require("../middlewares/validateTokenHandler");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "images"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/register", upload.single("photo"), registerContact);
router.post("/login", loginContactByFace);
router.get("/profile", validateContactToken, seeProfile);

module.exports = router;
