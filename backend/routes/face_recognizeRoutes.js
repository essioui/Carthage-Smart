const express = require("express");
const { recognizeFace } = require("../controllers/face_recognizeController");

const router = express.Router();

router.post("/recognize", recognizeFace);

module.exports = router;
