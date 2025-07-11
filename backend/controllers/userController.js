const express = require("express");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const contact = require("../models/contactModel");

// @description Register a User
// @route POST /users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { user_name, CIN, password, passwordConfirm } = req.body;

    if (!user_name || !CIN || !password || !passwordConfirm) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    if (password !== passwordConfirm) {
        res.status(400);
        throw new Error("Passwords do not match");
    }

    const existingUser = await User.findOne({ CIN });
    if (existingUser) {
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        user_name,
        CIN,
        password: hashedPassword,
    });

    if (user) {
        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            _id: user.id,
            user_name: user.user_name,
            CIN: user.CIN,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @description Login a User
// @route POST /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const user = await User.findOne({ user_name });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            _id: user.id,
            user_name: user.user_name,
            CIN: user.CIN,
            token: token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid credentials");
    }
});

// @description Get user profile
// @route GET /users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json(user);
});

// @description Get current user info + all contacts (read-only)
// @route GET /users/info
// @access Private
const currentUserInfo = asyncHandler(async (req, res) => {
    const userData = req.user;

    const contacts = await contact.find().select("-password");

    res.status(200).json({
        user: userData,
        contacts: contacts,
    });
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    currentUserInfo,
};
