const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Contact = require("../models/contactModel");

//@description Register a contact
//@route post /contactauth/register
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
//@route post /contactauth/login
//access public
const loginContactByFace = asyncHandler(async (req, res) => {
    const { user_name, password, face_match } = req.body;

    // If user_name and password are entered ==> traditional login
    if (user_name && password) {
        const contact = await Contact.findOne({ user_name });

        if (contact && (await bcrypt.compare(password, contact.password))) {
            const token = jwt.sign(
                { id: contact._id },
                process.env.CONTACT_SECRET,
                { expiresIn: "30d" }
            );

            return res.json({
                _id: contact.id,
                user_name: contact.user_name,
                CIN: contact.CIN,
                token: token,
            });
        } else {
            res.status(400);
            throw new Error("Invalid credentials");
        }
    }

    // If face_match arrives ==> Face login
    if (face_match) {
        const loginData = await loginContactByFace(face_match);
        return res.json(loginData);
    }

    res.status(400);
    throw new Error("Please provide either username+password or face_match");
});

//@description Get contact profile
//@route GET /contactauth/profile
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
    loginContactByFace,
    seeProfile
};
