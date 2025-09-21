const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = mongoose.Schema(
  {
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
    raw_CIN: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    password: {
      type: String,
      required: [true, "Please add user password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
