const express = require("express");
const router = express.Router();
const validateUserToken = require("../middlewares/validateUserToken");
const { getLastConsumptionByAddress } = require("../controllers/userContactController");

router.post("/", validateUserToken, getLastConsumptionByAddress);

module.exports = router;
