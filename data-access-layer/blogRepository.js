import dotenv from "dotenv";
dotenv.config();
let Blog;
if (process.env.NODE_ENV !== "test") {
  import("../config/database.js")
    .then((db) => {
      Blog = db.default.Blog;
    })
    .catch((error) => console.log(error));
} else {
  import("../config/test/database.js")
    .then((db) => {
      Blog = db.default.Blog;
    })
    .catch((error) => console.log(error));
}

const limit = process.env.PER_PAGE_LIMIT;

class BlogRepository {
  async findAll() {
    return Blog.find();
  }
  async findOnPage(page) {
    const offset = (page - 1) * limit;
    return Blog.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
  }
  async find(id) {
    return Blog.findById(id);
  }
  async create(blogData) {
    const blog = new Blog(blogData);
    return blog.save();
  }
  async update(id, updates) {
    return Blog.findOneAndUpdate({ _id: id }, updates, {
      new: true,
      runValidators: true,
    });
  }
  async delete(id) {
    return Blog.findByIdAndDelete(id);
  }
}

export default new BlogRepository();
