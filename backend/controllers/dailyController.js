const asyncHandler = require("express-async-handler");
const DailyConsumption = require("../models/dailyConsumptionModel");
const fs = require("fs");
const path = require("path");

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

// @desc Export daily consumption of the logged-in user to CSV
// @route GET /contactauth/profile/daily/export
// @access Private
const getAllData = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  // Fetch all user data and sort it by date
  const dailyDocs = await DailyConsumption.find({ contact: contactId }).sort({ date: 1 });

  if (!dailyDocs.length) {
    return res.status(404).json({ message: "No daily consumption data found for this user" });
  }

  // Make sure the csv folder exists
  const csvDir = path.join(__dirname, "../csv/contacts");
  
  if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true });


  const filePath = path.join(csvDir, `${contactId}.csv`);
  const ws = fs.createWriteStream(filePath);

  // Header writing
  ws.write("date,consumption\n");

  // Data entry
  for (const doc of dailyDocs) {
    ws.write(`${doc.date.toISOString().split("T")[0]},${doc.consumption}\n`);
  }

  ws.end();

  ws.on("finish", () => {
    res.json({ message: "Your daily consumption exported to CSV successfully", file: filePath });
  });

  ws.on("error", (err) => {
    console.error("CSV write error:", err);
    res.status(500).json({ message: "Failed to write CSV file" });
  });
});

module.exports = { 
  addDailyConsumption,
  getAllData, 
};
