const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: [true, "Please add the user name"],
    },
    CIN: {
        type: String,
        required: [true, "Please add user CIN"],
        unique: true,
        match: [/^\d{8}$/, "CIN must be exactly 8 digits"],
    },
    password: {
        type: String,
        required: [true, "Please add user password"],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
