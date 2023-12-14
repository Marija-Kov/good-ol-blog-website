import { wss } from "../app.js";
import Blog from "../data-access-layer/blogRepository.js";

const blog_index = (req, res) => {
  Blog.findOnPage(1)
    .then((result) => {
      res.status(200).render("blogs/index", {
        title: "All Blogs",
        blogs: result,
        host: process.env.HOST,
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
      console.log(`Error: ${error.message}`);
    });
};

const blog_load_more = (req, res) => {
  const nextPage = req.body.currentPage + 1;
  Blog.findOnPage(nextPage)
    .then((result) => {
      res.status(200).json({ blogs: result, currentPage: nextPage });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
      console.log(`Error: ${error.message}`);
    });
};

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.find(id)
    .then((result) => {
      if (!result) {
        res.status(404).render("404", { title: "Page Not Found" });
      } else {
        res
          .status(200)
          .render("blogs/details", { blog: result, title: "Blog Details" });
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const blog_create_get = (req, res) => {
  try {
    res.status(200).render("blogs/create", { title: "Create" });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const blog_create_post = (req, res) => {
  const { title, snippet, body } = req.body;
  if (!res.locals.user) {
    return res.status(400).redirect("/blogs/create");
  }
  if (!title || title.length > 50) {
    return res.status(400).render("blogs/create", {
      title: "create",
      draft: {
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { title: "⚠Title must be 1-50 characters long" },
    });
  }
  if (!snippet || snippet.length > 100) {
    return res.status(400).render("blogs/create", {
      title: "create",
      draft: {
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { snippet: "⚠Snippet must be 1-100 characters long" },
    });
  }
  if (!body || body.length > 2000) {
    return res.status(400).render("blogs/create", {
      title: "create",
      draft: {
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { body: "⚠Blog body must be 1-2000 characters long" },
    });
  }
  const maxBlogs =
    process.env.NODE_ENV !== "test"
      ? process.env.MAX_BLOGS_LIMIT
      : process.env.TEST_MAX_BLOGS_LIMIT;
  Blog.findAll()
    .then((blogs) => {
      if (blogs.length >= maxBlogs) {
        const id = blogs[0]._id;
        Blog.delete(id)
          .then((blog) => {
            res.status(200);
            wss.clients.forEach((client) => {
              client.send(`♻️ Blogs maxed out, deleted blog "${blog.title}"`);
            });
          })
          .catch((error) => {
            res.status(400).json({ error: error.message });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });

  Blog.create(req.body)
    .then((blog) => {
      res.status(200).redirect("/blogs");
      wss.clients.forEach((client) => {
        client.send(`👓 New blog: "${blog.title}"`);
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

const blog_delete = (req, res) => {
  if (!res.locals.user) {
    return res.status(400).redirect("/blogs/create");
  }
  const id = req.params.id;
  Blog.delete(id)
    .then((blog) => {
      res.status(200).redirect("/blogs");
      wss.clients.forEach((client) => {
        client.send(`🗑️ Someone deleted blog: "${blog.title}"`);
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

const blog_update_get = (req, res) => {
  if (!res.locals.user) {
    return res.status(400).redirect("/blogs/create");
  }
  const id = req.params.id;
  Blog.find(id)
    .then((result) => {
      res
        .status(200)
        .render("blogs/update", { blog: result, title: "Update Blog" });
    })
    .catch((error) => {
      res
        .status(404)
        .render("404", { title: "Page Not Found", message: error.message });
    });
};

const blog_update_patch = (req, res) => {
  if (!res.locals.user) {
    return res.status(400).redirect("/blogs/create");
  }
  const id = req.params.id;
  const { title, snippet, body } = req.body;
  if (!title || title.length > 50) {
    return res.status(400).render(`blogs/update`, {
      title: "Update Blog",
      blog: {
        _id: id,
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { title: "⚠Title must be 1-50 characters long" },
    });
  }
  if (!snippet || snippet.length > 100) {
    return res.status(400).render(`blogs/update`, {
      title: "Update Blog",
      blog: {
        _id: id,
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { snippet: "⚠Snippet must be 1-100 characters long" },
    });
  }
  if (!body || body.length > 2000) {
    return res.status(400).render(`blogs/update`, {
      title: "Update Blog",
      blog: {
        _id: id,
        title: title,
        snippet: snippet,
        body: body,
      },
      error: { body: "⚠Body must be 1-2000 characters long" },
    });
  }

  Blog.update(id, req.body)
    .then((blog) => {
      res.status(200).redirect(`/blogs/${id}`);
      wss.clients.forEach((client) => {
        client.send(
          `✍️ Someone edited a blog, id: ${id}, now titled: "${blog.title}"`
        );
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

const blogController = {
  blog_index,
  blog_load_more,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  blog_update_get,
  blog_update_patch,
};

export default blogController;
