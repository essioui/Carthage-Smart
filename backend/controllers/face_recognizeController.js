const asyncHandler = require("express-async-handler");
const { spawnSync } = require("child_process");
const path = require("path");
const jwt = require("jsonwebtoken");
const Contact = require("../models/contactModel");

const scriptPath = path.join(__dirname, "../scripts/face_recognize.py");

// @desc    Recognize face and authenticate contact
// @route   POST /contactauth/recognize
// @access  Public
const recognizeFace = asyncHandler(async (req, res) => {
  const { source } = req.body;
  if (!source) throw new Error("Please provide a source");

  const result = spawnSync("python3", [scriptPath, source], {
    encoding: "utf-8",
  });
  if (result.error) throw new Error(result.error.message);

  const output = JSON.parse(result.stdout);

  if (output.match && output.distance <= 0.6) {
    const faceFile = path.basename(output.match);
    const contact = await Contact.findOne({
      photo: { $regex: faceFile + "$" },
    });

    if (!contact) return res.status(400).json({ error: "Face not recognized" });

    const token = jwt.sign({ id: contact._id }, process.env.CONTACT_SECRET, {
      expiresIn: "30d",
    });

    return res.json({
      _id: contact._id,
      user_name: contact.user_name,
      CIN: contact.CIN,
      token,
    });
  } else {
    return res.status(400).json({ error: "Face not recognized" });
  }
});

module.exports = { recognizeFace };
