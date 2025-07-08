const express = require("express");
const Router = express.Router();

const {
    registerContact,
    loginContact,
    seeProfile
} = require("../controllers/contactAuthController");

const validateContactToken = require("../middlewares/validateContactTokenHandler");

Router.post("/register", registerContact);
Router.post("/login", loginContact);
Router.get("/profile", validateContactToken, seeProfile);

module.exports = Router;
