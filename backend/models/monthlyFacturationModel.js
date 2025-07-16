const mongoose = require("mongoose");

const monthlyFacturationSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
    required: true
  },
  current_index: {
    type: Number,
    required: true
  },
  difference: {
    type: Number,
    default: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("MonthlyFacturation", monthlyFacturationSchema);
