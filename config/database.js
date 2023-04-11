const mongoose = require("mongoose");
const userSchema = require("../models/user");
require("dotenv").config();

const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = connection.model("User", userSchema);

module.exports = connection;