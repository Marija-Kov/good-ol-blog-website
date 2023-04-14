const mongoose = require("mongoose");
const blogSchema = require("../models/blog");
const userSchema = require("../models/user");
require("dotenv").config();

const dbURI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI; 
const connection = mongoose.createConnection(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = connection.model("User", userSchema);
const Blog = connection.model("Blog", blogSchema);

module.exports = { connection, User, Blog };