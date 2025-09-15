const express = require("express");
const router = express.Router();
const { 
    clusterContacts,
    getAddress,
    getContactsByAddress
 } = require("../controllers/userControllerCluster");
const validateUserToken = require("../middlewares/validateUserToken");

router.post("/", validateUserToken, clusterContacts);

router.get("/list", validateUserToken, getAddress);

router.get("/address", validateUserToken, getContactsByAddress);

module.exports = router;
