const express = require("express");
const router = express.Router();

const { 
  addMonthlyReading,
  calculateFacturations,
  getAllFacturations
} = require("../controllers/monthlyFacturationController");

const validateContactToken = require("../middlewares/validateTokenHandler");

router.use(validateContactToken);

router.post("/profile/facturation", addMonthlyReading);

router.get("/profile/facturation/calculate", calculateFacturations);

router.get("/profile/facturation/all", getAllFacturations);

module.exports = router;
