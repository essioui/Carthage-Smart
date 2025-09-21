const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const DailyConsumption = require("../models/dailyConsumptionModel");

// @desc Add daily consumption from CSV to MongoDB
// @route POST /contactauth/profile/daily
// @access Private
const addDailyConsumption = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No CSV file uploaded");
  }

  const contactId = req.contact.id;
  const content = fs.readFileSync(req.file.path, "utf-8");
  const rows = content.trim().split("\n").slice(1);

  const dailyRecords = rows.map((row) => {
    const [date, consumption] = row.split(",");
    return {
      contact: contactId,
      date: new Date(date),
      consumption: Number(consumption),
    };
  });

  try {
    await DailyConsumption.insertMany(dailyRecords);
    res
      .status(201)
      .json({ message: "Daily CSV data saved", count: dailyRecords.length });
  } catch (err) {
    console.error("MongoDB insert error:", err);
    res.status(500).json({ message: "Error saving to DB", error: err });
  }
});

// @desc Get all daily consumption data
// @route GET /contactauth/profile/daily
// @access Private
const getAllData = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;
  const filePath = path.join(__dirname, "../csv/contacts", `${contactId}.csv`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No daily consumption file found" });
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const rows = content.trim().split("\n").slice(1);
  const data = rows.map((row) => {
    const [date, consumption] = row.split(",");
    return { date, consumption: Number(consumption) };
  });

  res.json({ message: "Daily consumption retrieved", data });
});

module.exports = { addDailyConsumption, getAllData };
