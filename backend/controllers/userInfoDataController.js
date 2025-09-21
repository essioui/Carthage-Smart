const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

// Function to call the Python script and analyze the CSV
function analyzeCSV(filePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      __dirname,
      "../scripts/analyze_consumption.py"
    );

    execFile("python3", [scriptPath, filePath], (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", error);
        console.error("stderr:", stderr);
        return reject(error);
      }

      try {
        // Remove any spaces or newlines from the beginning and end
        const cleanStdout = stdout.trim();
        const result = JSON.parse(cleanStdout);
        resolve(result);
      } catch (err) {
        console.error("JSON parse error:", err);
        console.error("stdout content:", stdout);
        reject(err);
      }
    });
  });
}

// Description: Analyze user data from CSV and return insights
// Route: GET /users/analyse
// Access: Private
const analyseUsers = async (req, res) => {
  const { address } = req.query;
  if (!address)
    return res.status(400).json({ error: "address is required in query" });

  const csvPath = path.join(__dirname, `../csv/userData/${address}.csv`);
  if (!fs.existsSync(csvPath))
    return res.status(404).json({ error: "CSV file not found" });

  try {
    const result = await analyzeCSV(csvPath);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze CSV" });
  }
};

module.exports = { analyseUsers };
