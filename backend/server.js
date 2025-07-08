require("dotenv").config();
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const contactAuthRoutes = require("./routes/contactAuthRoutes");

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/contacts", require("./routes/contactRoutes"));

app.use("/contactauth", contactAuthRoutes);

app.use("/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
