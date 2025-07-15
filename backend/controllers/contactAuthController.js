const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Contact = require("../models/contactModel");

//@description Register a contact
//@route post /contacts/register
//access public
const registerContact = asyncHandler(async (req, res) => {
    const { 
        user_name, CIN, password, passwordConfirm, address
     } = req.body;

    if (!user_name || !CIN || !password || !address ) {
        res.status(400);
        throw new Error("Please add all fields include photo");
    }

    if (!req.file) {
        res.status(400);
        throw new Error("Photo is required");
    }

    const existingContact = await Contact.findOne({ CIN });
    if (existingContact) {
        res.status(400);
        throw new Error("Contact already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create contact
    const contact = await Contact.create({
        user_name,
        CIN,
        password: hashedPassword,
        address,
        photo: req.file.path
    });

    console.log("Created contact:", contact);

    if (contact) {
        // Generate JWT token
        const token = jwt.sign(
            { id: contact._id },
            process.env.CONTACT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            _id: contact.id,
            user_name: contact.user_name,
            CIN: contact.CIN,
            address: contact.address,
            photo: contact.photo,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid contact data");
    }
});

//@description Login a contact
//@route post /contacts/login
//access public
const loginContact = asyncHandler(async (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password ) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const contact = await Contact.findOne({ user_name });

    // Compare password and hash password
    if (contact && (await bcrypt.compare(password, contact.password))) {
        const token = jwt.sign(
            { id: contact._id },
            process.env.CONTACT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            _id: contact.id,
            user_name: contact.user_name,
            CIN: contact.CIN,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

//@description Get contact profile
//@route GET /contactauth/seeprofile
//@access Private
const seeProfile = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.contact.id).select("-password");

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json(contact);
});

module.exports = {
    registerContact,
    loginContact,
    seeProfile
};
