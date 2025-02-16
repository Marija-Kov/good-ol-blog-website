import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "⚠Blog title is required"],
      maxlength: [50, "⚠Max allowed length is 50 characters"],
    },
    snippet: {
      type: String,
      required: [true, "⚠Blog snippet is required"],
      maxlength: [100, "⚠Max allowed length is 100 characters"],
    },
    body: {
      type: String,
      required: [true, "⚠Blog body is required"],
      maxlength: [2000, "⚠Max allowed length is 2000 characters"],
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default blogSchema;
