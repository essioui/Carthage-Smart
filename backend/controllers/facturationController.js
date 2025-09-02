const asyncHandler = require("express-async-handler");
const DailyConsumption = require("../models/dailyConsumptionModel");
const MonthlyFacturation = require("../models/monthlyFacturationModel");
const { spawn } = require("child_process");

const runPythonMonthly = (dailyData) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["./scripts/monthlyFacturation.py"]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => output += data.toString());
    python.stderr.on("data", (data) => error += data.toString());

    python.on("close", () => {
      if (error) return reject(error);
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject(e);
      }
    });

    python.stdin.write(JSON.stringify(dailyData));
    python.stdin.end();
  });
};

// @description Get monthly data from Python script
// @route POST /contactauth/profile/facturation/monthly
// @access Private
const getMonthlyDataPython = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  const dailyData = await DailyConsumption.find(
    { contact: contactId },
    { _id: 0, date: 1, consumption: 1 }
  );

  if (!dailyData.length) {
    return res.status(400).json({ message: "No daily data found for this contact" });
  }

  let monthlyData;
  try {
    monthlyData = await runPythonMonthly(dailyData);
  } catch (err) {
    return res.status(500).json({ message: "Python script error: " + err });
  }

  res.status(200).json({
    message: "Daily data successfully converted to monthly data",
    data: monthlyData,
  });
});

// @description Calculate monthly facture and save to DB
// @route POST /contactauth/profile/facturation/calculate
// @access Private
const calculateMonthlyFacture = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  const dailyData = await DailyConsumption.find(
    { contact: contactId },
    { _id: 0, date: 1, consumption: 1 }
  );

  if (!dailyData.length) {
    return res.status(400).json({ message: "No daily data found for this contact" });
  }

  let monthlyData;
  try {
    monthlyData = await runPythonMonthly(dailyData);
  } catch (err) {
    return res.status(500).json({ message: "Python script error: " + err });
  }

  const pricePerKwh = 0.2635; // GBP/kWh
  const standingChargeDaily = 0.5368; // GBP/day

  const facturesToSave = monthlyData.map(item => {
    const [year, month] = item.year_month.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const consumptionCost = item.total_kwh * pricePerKwh;
    const standingCharge = standingChargeDaily * daysInMonth;
    const totalFacture = consumptionCost + standingCharge;

    return {
      contact: contactId,
      year,
      month,
      totalConsumption: Number(item.total_kwh.toFixed(2)),
      total: Number(totalFacture.toFixed(2))
    };
  });

  try {
    await MonthlyFacturation.insertMany(facturesToSave, { ordered: false });
  } catch (err) {
    console.error("Insert error:", err);
    return res.status(500).json({ message: "Error saving to DB", error: err });
  }

  res.status(200).json({
    message: "Monthly facture calculated and saved successfully",
    data: facturesToSave,
  });
});

// @description Get all factures for the current user
// @route GET /contactauth/profile/facturation/all
// @access Private
const getAllFactures = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  const factures = await MonthlyFacturation.find({ contact: contactId })
    .sort({ year: 1, month: 1 });

  if (!factures.length) {
    return res.status(404).json({ message: "No factures found for this contact" });
  }

  res.status(200).json({
    message: "All factures retrieved successfully",
    data: factures,
  });
});


module.exports = {
  getMonthlyDataPython,
  calculateMonthlyFacture,
  getAllFactures
};
