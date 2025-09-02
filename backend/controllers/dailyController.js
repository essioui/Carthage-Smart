const asyncHandler = require("express-async-handler");
const DailyConsumption = require("../models/dailyConsumptionModel");

//@description Save daily consumption
//@route POST /contactauth/profile/daily
//@access Private
const addDailyConsumption = asyncHandler(async (req, res) => {
  const { consumption, date } = req.body;
  const contactId = req.contact.id;

  if (consumption === undefined || isNaN(consumption)) {
    res.status(400);
    throw new Error("Please provide a valid consumption value");
  }

  const dateObj = date ? new Date(date) : new Date();

  const existing = await DailyConsumption.findOne({ contact: contactId, date: dateObj });
  if (existing) {
    res.status(400);
    throw new Error("Consumption for this day already exists");
  }

  const newDaily = await DailyConsumption.create({
    contact: contactId,
    date: dateObj,
    consumption,
  });

  res.status(201).json(newDaily);
});

module.exports = { addDailyConsumption };
