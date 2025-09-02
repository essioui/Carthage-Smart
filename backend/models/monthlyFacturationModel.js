const mongoose = require("mongoose");

const monthlyFacturationSchema = mongoose.Schema(
  {
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    totalConsumption: { type: Number, required: true },
    total: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MonthlyFacturation", monthlyFacturationSchema);
