const express = require("express");
const router = express.Router();
const { addDailyConsumption } = require("../controllers/dailyController");
const validateContactToken = require("../middlewares/validateTokenHandler");

router.use(validateContactToken);

router.post("/daily", addDailyConsumption);

module.exports = router;
