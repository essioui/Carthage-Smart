const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const plotWeather = asyncHandler(async (req, res) => {
  try {
    const contact = await Contact.findById(req.contact.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    const contactId = contact._id.toString();
    const contactCsvPath = path.join(
      __dirname,
      `../csv/contacts/${contactId}.csv`
    );
    const mergedFolder = path.join(__dirname, "../csv/merged_clients");
    fs.mkdirSync(mergedFolder, { recursive: true });

    const weatherCsvPath = path.join(
      __dirname,
      `../csv/weather/${contact.address}.csv`
    );

    const pythonScript = path.join(__dirname, "../csv/merge_clients.py");
    const { spawn } = require("child_process");

    const python = spawn("python3", [
      pythonScript,
      contactCsvPath,
      weatherCsvPath,
      mergedFolder,
    ]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => (output += data.toString()));
    python.stderr.on("data", (data) => (errorOutput += data.toString()));

    python.on("close", (code) => {
      if (code !== 0) return res.status(500).json({ error: errorOutput });

      const mergedCsvPath = path.join(mergedFolder, `${contactId}.csv`);
      const results = [];

      fs.createReadStream(mergedCsvPath)
        .pipe(csv())
        .on("data", (row) => {
          results.push({ date: row.date, tavg: row.tavg });
        })
        .on("end", () => {
          res.json({ data: results });
        });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { plotWeather };
