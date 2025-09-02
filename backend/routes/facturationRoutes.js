const express = require("express");
const router = express.Router();
const validateContactToken = require("../middlewares/validateTokenHandler");
const { 
    getMonthlyDataPython,
    calculateMonthlyFacture, 
    getAllFactures
} = require("../controllers/facturationController");

router.use(validateContactToken);

router.post("/monthly", getMonthlyDataPython);

router.post("/calculate", calculateMonthlyFacture);

router.get("/all", getAllFactures);

module.exports = router;
