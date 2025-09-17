const express = require("express");
const router = express.Router();
const { showPrediction } = require("../controllers/showPredictionController");
const validateContactToken = require("../middlewares/validateTokenHandler");

router.use(validateContactToken);

router.get("/show", validateContactToken, showPrediction);

module.exports = router;
