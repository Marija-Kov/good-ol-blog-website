const mongoose = require("mongoose");
require("dotenv").config();

const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// just like User model

const OtherUser = connection.model(
  "OtherUser",
  new mongoose.Schema({
    email: String,
    hash: String,
    salt: String,
    admin: Boolean,
  })
);

module.exports = connection;