const mongoose = require("mongoose");

const DailyConsumptionSchema = mongoose.Schema(
  {
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    date: { type: Date, required: true },
    consumption: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyConsumption", DailyConsumptionSchema);
