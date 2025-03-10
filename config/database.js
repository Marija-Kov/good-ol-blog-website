import mongoose from "mongoose";
import blogSchema from "../schemas/blog.js";
import userSchema from "../schemas/user.js";
import dotenv from "dotenv";
dotenv.config();

const connection = mongoose.createConnection(process.env.MONGO_URI);

const User = connection.model("User", userSchema);
const Blog = connection.model("Blog", blogSchema);

const DB = {
  connection,
  User,
  Blog,
};

export default DB;
