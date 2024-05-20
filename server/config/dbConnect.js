const mongoose = require("mongoose");
// Connect to MongoDB
const mongoConnect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
    // Additional setup or starting the server can be done here
  });
};

module.exports = mongoConnect;
