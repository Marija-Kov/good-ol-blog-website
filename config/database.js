import mongoose from "mongoose";
import blogSchema from "../models/blog.js";
import userSchema from "../models/user.js";
import dotenv from "dotenv";
dotenv.config()

const connection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = connection.model("User", userSchema);
const Blog = connection.model("Blog", blogSchema);

const DB = {
  connection,
  User,
  Blog
}

export default DB;