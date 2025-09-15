const express = require("express");
const router = express.Router();
const usersShowController = require("../controllers/usersShowControllers");
const {
    registerUser,
    loginUser,
    getUserProfile,
    currentUserInfo,
    getContactById,
    getAllFactures
} = require("../controllers/userController");

const validateToken = require("../middlewares/validateUserToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", validateToken, getUserProfile);
router.get("/info", validateToken, currentUserInfo);
router.get("/contact/:id", validateToken, getContactById);
router.get("/factures", validateToken, getAllFactures);
router.post("/show", usersShowController);

module.exports = router;
