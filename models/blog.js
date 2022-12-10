const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });

//// MODEL:

const Blog = mongoose.model('Blog', blogSchema);  // 1st arg: name of the model, 2nd arg: name of the schema
module.exports = Blog;