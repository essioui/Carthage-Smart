const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    user_name: {
        type: String,
        required: [true, "Please add the contact user_name"],
    },
    CIN: {
        type: String,
        required: [true, "Please add contact CIN"],
        unique: true,
        match: [/^\d{8}$/, "CIN must be exactly 8 digits"],
    },
    password: {
        type: String,
        required: [true, "Please add contact password"],
    },
    address: {
        type: String,
    },
    photo: {
        type: String,
        required: [true, "Please add contact photo"],
    },
}, {
    timestamps: true
}
);

module.exports = mongoose.model("contact", contactSchema)
