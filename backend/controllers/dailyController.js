const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

// @desc Add daily consumption (append to CSV file)
// @route POST /contactauth/profile/daily
// @access Private
const addDailyConsumption = asyncHandler(async (req, res) => {
  const { consumption, date } = req.body;
  const contactId = req.contact.id;

  if (consumption === undefined || isNaN(consumption)) {
    res.status(400);
    throw new Error("Please provide a valid consumption value");
  }

  const dateObj = date ? new Date(date) : new Date();

  // create CSV directory if not exists
  const csvDir = path.join(__dirname, "../csv/contacts");
  if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true });

  const filePath = path.join(csvDir, `${contactId}.csv`);

  // headers if file doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "date,consumption\n");
  }

  // add new line
  const line = `${dateObj.toISOString().split("T")[0]},${consumption}\n`;
  fs.appendFileSync(filePath, line);

  res.status(201).json({ message: "Daily consumption saved", file: filePath });
});

// @desc Get all daily consumption from CSV file
// @route GET /contactauth/profile/daily/export
// @access Private
const getAllData = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  const filePath = path.join(__dirname, "../csv/contacts", `${contactId}.csv`);

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ message: "No daily consumption file found for this user" });
  }

  // read and parse CSV
  const content = fs.readFileSync(filePath, "utf-8");
  const rows = content.trim().split("\n").slice(1);
  const data = rows.map((row) => {
    const [date, consumption] = row.split(",");
    return { date, consumption: Number(consumption) };
  });

  res.json({ message: "Daily consumption data retrieved", data });
});

module.exports = {
  addDailyConsumption,
  getAllData,
};
