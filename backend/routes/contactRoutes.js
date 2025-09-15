const express = require("express");
const router = express.Router();
const {
    updateContact,
    deleteContact,
    getContact
} = require("../controllers/contactController");

const validatetoken = require("../middlewares/validateTokenHandler");

router.use(validatetoken);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
