const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      minlength: [1, "Please enter at least one character"],
    },
    snippet: {
      type: String,
      required: [true, "Blog snippet is required"],
      minlength: [1, "Please enter at least one character"],
    },
    body: {
      type: String,
      required: [true, "Blog body is required"],
      minlength: [1, "Please enter at least one character"],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);  
module.exports = Blog;