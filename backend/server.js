require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const contactAuthRoutes = require("./routes/contactAuthRoutes");
const validateContactToken = require("./middlewares/validateTokenHandler");
const facturationRoutes = require("./routes/monthlyFacturationRoutes");
const path = require("path");

connectDb();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/contacts", require("./routes/contactRoutes"));

app.use("/contactauth", contactAuthRoutes);

app.use("/contactauth/profile/facturation", facturationRoutes);

app.use("/users", require("./routes/userRoutes"));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
