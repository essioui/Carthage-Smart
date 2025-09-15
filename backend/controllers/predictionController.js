const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

// @description Run Python prediction and save JSON + plot
// @route GET /contactauth/profile/facturation/predict
// @access Private
const predictClient = asyncHandler(async (req, res) => {
  try {
    const contactId = req.contact.id;

    // CSV path
    const csvPath = path.join(__dirname, `../csv/merged_clients/${contactId}.csv`);
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "CSV Not Found", details: csvPath });
    }

    // Python script path
    const pyPath = path.join(__dirname, "../scripts/predict_clients.py");
    if (!fs.existsSync(pyPath)) {
      return res.status(500).json({ error: "Python file missing", details: pyPath });
    }

    const py = spawn("python3", [pyPath, csvPath]);

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (data) => { stdoutData += data.toString(); });
    py.stderr.on("data", (data) => { stderrData += data.toString(); });

    py.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: "Python script failed",
          details: stderrData || `Exited with code ${code}`,
        });
      }

      try {
        // Extract only the line containing JSON
        const lines = stdoutData
          .split("\n")
          .filter(line => line.trim().startsWith("{") && line.trim().endsWith("}"));
        if (!lines.length) throw new Error("No JSON output from Python");

        let jsonString = lines[0].trim();

        let result;
        try {
          result = JSON.parse(jsonString);
        } catch {
          result = JSON.parse(JSON.parse(jsonString));
        }

        // Save JSON to file
        const predictionsDir = path.join(__dirname, "../csv/predictions");
        if (!fs.existsSync(predictionsDir)) fs.mkdirSync(predictionsDir, { recursive: true });

        const jsonPath = path.join(predictionsDir, `${contactId}_pred.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), "utf-8");

        delete result.dates_predicted;

        res.status(200).json({
          message: "Prediction generated and saved",
          data: result
        });
      } catch (err) {
        res.status(500).json({
          error: "Failed to parse Python output",
          details: stdoutData || err.message,
        });
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { predictClient };
