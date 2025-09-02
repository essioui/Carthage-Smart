const express = require("express");
const router = express.Router();
const validateContactToken = require("../middlewares/validateTokenHandler");
const { getMonthlyDataPython } = require("../controllers/facturationController");

router.use(validateContactToken);

router.post("/monthly", getMonthlyDataPython);


module.exports = router;
