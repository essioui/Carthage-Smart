const express = require("express");
const router = express.Router();

const {
    updateContact,
    deleteContact,
} = require("../controllers/contactController");

const validatetoken = require("../middlewares/validateTokenHandler");

router.use(validatetoken);

router.route("/:id").put(updateContact).delete(deleteContact);

module.exports = router;
