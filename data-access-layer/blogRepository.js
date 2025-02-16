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

  async find(params) {
    if (!params) {
      return Blog.find();
    } else if (params.page && !params.id) {
      const offset = (params.page - 1) * limit;
      return Blog.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
    } else if (params.id && !params.page) {
      return Blog.findById(params.id);
    } else {
      console.error(`BlogRepository: ERROR: Bad Parameters. Valid parameters:
        1. { id: yourId } (get a specific entry)
        2. { page: yourPage } (get all entries on page)
        3. null/undefined  (get all entries)
        `)
    }
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
