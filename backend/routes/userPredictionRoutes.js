const express = require("express");
const router = express.Router();
const { predictClient } = require("../controllers/userPredictionController");
const validateUserToken = require("../middlewares/validateUserToken");

router.post("/predict", validateUserToken, predictClient);

module.exports = router;
