const path = require("path");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

// @description Show prediction + plot for a contact
// @route GET /contactauth/profile/facturation/show
// @access Private
const showPrediction = asyncHandler(async (req, res) => {
  try {
    const contactId = req.contact.id;

    // JSON file path
    const jsonPath = path.join(
      __dirname,
      `../csv/predictions/${contactId}_pred.json`
    );
    if (!fs.existsSync(jsonPath)) {
      return res
        .status(404)
        .json({ error: "Prediction JSON not found", details: jsonPath });
    }

    // Read prediction JSON
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // Build array with date + consumption (one-hot style)
    const dataArray = jsonData.dates_predicted.map((date) => ({
      date,
      consumption: jsonData.predicted[date],
    }));

    // Build image path (from clients_plot)
    const plotFile = path.join(__dirname, `../${jsonData.plot_path}`);
    const plotExists = fs.existsSync(plotFile);

    res.status(200).json({
      message: "Prediction data retrieved",
      data: dataArray,
      plot_path: plotExists
        ? `/clients_plot/${path.basename(jsonData.plot_path)}`
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { showPrediction };
