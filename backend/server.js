require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const contactAuthRoutes = require("./routes/contactAuthRoutes");
const dailyRoutes = require("./routes/dailyRoutes");
const validateContactToken = require("./middlewares/validateTokenHandler");
const facturationRoutes = require("./routes/facturationRoutes");
const usersShowController = require("./controllers/usersShowControllers");
const userContactRoutes = require("./routes/userContactRoutes");
const userInfoDataRoutes = require("./routes/userInfoDataRoutes");
const userPredictionRoutes = require("./routes/userPredictionRoutes");

const faceRoutes = require("./routes/face_recognizeRoutes");
const path = require("path");

connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/face", faceRoutes);

app.use("/contacts", require("./routes/contactRoutes"));

app.use("/contactauth", contactAuthRoutes);

app.use("/contactauth/profile", dailyRoutes);

app.use("/contactauth/profile/facturation", require("./routes/facturationRoutes"));

app.use("/contactauth/profile/facturation/predict", require("./routes/predictionRoutes"));

app.use("/contactauth/profile/facturation/show", require("./routes/predictionRoutes"));

app.use("/users", require("./routes/userRoutes"));

app.use("/users/cluster", require("./routes/userClusterRoutes"));

app.use("/users", userPredictionRoutes);

app.use("/users", usersShowController);

app.use("/users/data", userContactRoutes);

app.use("/users/analyse", userInfoDataRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
