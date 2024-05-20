const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const path = require("path");
const port = process.env.PORT || 8080;
var bodyParser = require("body-parser");
const cors = require("cors");
const api = require("./routes");
const private = require("./routes/privateRoutes");
 
// public folder for image upload
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
const mongoose = require("mongoose");
require("dotenv").config();
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(express.json({ limit: "50mb" }));
// app.use(bodyParser.json({ limit: "30mb" })); // Adjust the limit as per your requirements
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Adjust the limit as per your requirements
app.use("/api", api);
app.use("/api", private);
 

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
