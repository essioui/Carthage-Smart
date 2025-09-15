const express = require("express");
const router = express.Router();
const validateContactToken = require("../middlewares/validateTokenHandler");
const { 
    predictClient
 } = require("../controllers/predictionController");

router.use(validateContactToken);

router.get("/", predictClient);

module.exports = router;
