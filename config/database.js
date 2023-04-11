const mongoose = require("mongoose");
const blogSchema = require("../models/blog");
const userSchema = require("../models/user");
require("dotenv").config();

const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = connection.model("User", userSchema);
const Blog = connection.model("Blog", blogSchema);

module.exports = connection;