const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    currentUserInfo,
} = require("../controllers/userController");

const validateToken = require("../middlewares/validateUserToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", validateToken, getUserProfile);
router.get("/info", validateToken, currentUserInfo);

module.exports = router;
