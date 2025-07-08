const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/contact", (req, res) => {
  res.send("Welcome to the Carthage Smart Backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
