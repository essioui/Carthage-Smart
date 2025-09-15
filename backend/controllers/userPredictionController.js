const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { spawnSync } = require("child_process");

// @description Run Python prediction and save JSON + plot
// @route POST /users/predict
// @access Private
const predictClient = asyncHandler(async (req, res) => {
  try {
    const { address, days = 90 } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required in body" });
    }

    // CSV path based on address
    const csvPath = path.join(__dirname, `../csv/clusters/${address}.csv`);
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "CSV Not Found", details: csvPath });
    }

    // Python script path
    const pyPath = path.join(__dirname, "../scripts/user_predict.py");
    if (!fs.existsSync(pyPath)) {
      return res.status(500).json({ error: "Python file missing", details: pyPath });
    }

    // Run Python synchronously and wait for the result
    const py = spawnSync("python3", [pyPath, csvPath, "--days", days], {
      encoding: "utf-8",
      // 50MB to avoid large stdout problems
      maxBuffer: 1024 * 1024 * 50
    });

    if (py.status !== 0) {
      return res.status(500).json({
        error: "Python script failed",
        details: py.stderr || `Exited with code ${py.status}`,
      });
    }

    // Read JSON from users_plot file
    const jsonPath = path.join(__dirname, "../users_plot", `${address}_results.json`);
    if (!fs.existsSync(jsonPath)) {
      return res.status(500).json({ error: "JSON file not created", details: jsonPath });
    }

    const result = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    delete result.dates_predicted;

    res.status(200).json({
      message: "Prediction generated and saved",
      data: result
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { predictClient };
