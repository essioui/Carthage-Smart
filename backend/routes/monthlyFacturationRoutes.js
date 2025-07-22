const express = require("express");
const router = express.Router();

const { 
  addMonthlyReading,
  calculateFacturations,
  getAllFacturations
} = require("../controllers/monthlyFacturationController");

const validateContactToken = require("../middlewares/validateTokenHandler");

router.use(validateContactToken);

router.post("/", addMonthlyReading);

router.post("/calculate", calculateFacturations);

router.get("/all", getAllFacturations);

module.exports = router;
