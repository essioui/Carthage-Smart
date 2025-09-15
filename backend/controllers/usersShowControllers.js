const express = require("express");
const path = require("path");
const fs = require("fs");

// @description Show user prediction results and plot
// @route POST /users/show
// @access Public
const router = express.Router();

router.post("/show", (req, res) => {
  const { region } = req.body;
  if (!region) return res.status(400).json({ error: "Region is required" });

  const jsonPath = path.join(__dirname, "../users_plot", `${region}_results.json`);
  const plotPath = path.join(__dirname, "../users_plot", `${region}_trend_seasonal_cyclical.png`);

  if (!fs.existsSync(jsonPath)) return res.status(404).json({ error: "JSON not found" });
  if (!fs.existsSync(plotPath)) return res.status(404).json({ error: "Plot not found" });

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
// Remove the dates_predicted field if it exists
if (jsonData.dates_predicted) {
    delete jsonData.dates_predicted;
}

  const imageData = fs.readFileSync(plotPath);
  const base64Image = `data:image/png;base64,${imageData.toString("base64")}`;

  res.json({
    data: jsonData,
    plot_base64: base64Image
  });
});

module.exports = router;
