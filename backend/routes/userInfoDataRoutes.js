const express = require("express");
const router = express.Router();
const { analyseUsers } = require("../controllers/userInfoDataController");
const validateUserToken = require("../middlewares/validateUserToken");

router.get("/", validateUserToken, analyseUsers);

module.exports = router;
