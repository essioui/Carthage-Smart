const express = require("express");
const router = express.Router();
const validateContactToken = require("../middlewares/validateTokenHandler");
const { plotWeather } = require("../controllers/weatherController");

router.use(validateContactToken);

router.post("/", plotWeather);

module.exports = router;
