const asyncHandler = require("express-async-handler");
const DailyConsumption = require("../models/dailyConsumptionModel");
const { spawnSync } = require("child_process");

const getMonthlyDataPython = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  // Fetch all daily data for this contact
  const dailyData = await DailyConsumption.find(
    { contact: contactId },
    { _id: 0, date: 1, consumption: 1 }
  );

  if (!dailyData.length) {
    return res.status(400).json({ message: "No daily data found for this contact" });
  }

  // Convert data to JSON string
  const dailyJson = JSON.stringify(dailyData);

  // Call the Python script
  const pythonProcess = spawnSync("python3", [
    "./scripts/monthlyFacturation.py",
    dailyJson,
  ]);

  if (pythonProcess.error) {
    return res.status(500).json({ message: pythonProcess.error.message });
  }

  const resultJson = pythonProcess.stdout.toString();

  let monthlyData;
  try {
    monthlyData = JSON.parse(resultJson);
  } catch (err) {
    return res.status(500).json({ message: "Failed to parse Python output: " + err.message });
  }

  res.status(200).json({
    message: "Daily data successfully converted to monthly data",
    data: monthlyData,
  });
});

module.exports = { getMonthlyDataPython };
