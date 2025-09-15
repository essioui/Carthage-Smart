const mongoose = require("mongoose");

const addressConsumptionSchema = new mongoose.Schema({
  address: { type: String, required: true },
  contacts: [
    {
      contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
      totalConsumption: { type: Number, default: 0 }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AddressConsumption", addressConsumptionSchema);
