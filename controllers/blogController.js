const Blog = require("../models/blog");

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(result => {
      res  
         .status(200)
         .render("blogs/index", { title: "All Blogs", blogs: result })
    })
    .catch(error=> {
      res.status(400).json({ error: error.message });
      console.log(`Error: ${error.message}`);
    });
};
   
const blog_details = (req, res) => {
   const id = req.params.id;
   Blog.findById(id)
     .then(result => {
       res
         .status(200)
         .render("blogs/details", { blog: result, title: "Blog Details" });
     })
     .catch(error=> {
       res.status(404).render("404", { title: "Page Not Found", message: error.message });
     }); 
};

const blog_create_get = (req, res) => {
 try {
  res.status(200).render("blogs/create", { title: "Create" });
 } catch (error) {
  res.json({error: error.message})
 }
  
};

const blog_create_post = (req, res) => {
  if (!res.locals.user) { 
    return res.status(400).redirect("/blogs/create");
  }
  if(!req.body.title || !req.body.snippet || !req.body.body){
    return res.status(400).json({error: "Invalid blog input"})
  }
  const blog = new Blog(req.body); 
  blog
    .save()
    .then(result => {
      res
        .status(200)
        .redirect("/blogs");
    })
    .catch((error)=> {
      res.status(400).json({ error: error.message });
    });
};

const blog_delete = (req, res) => {
    if (!res.locals.user) {
      return res.status(400).redirect("/blogs/create");
    }
  const id = req.params.id;  
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res
        .status(200)
        .redirect("/blogs");
    })
    .catch((error)=> {
      res.status(400).json({ error: error.message });
    });
};

const blog_update_get = (req, res) => { 
      if (!res.locals.user) {
      return res.status(400).redirect("/blogs/create");
    }
  const id = req.params.id;
  Blog.findById(id)
     .then(result => {  
       res
         .status(200)
         .render("blogs/update", { blog: result, title: "Update Blog" });
     })
     .catch(error=> {
       res
         .status(404)
         .render("404", { title: "Page Not Found", message: error.message });
     }); 
};

const blog_update_patch = (req, res) => {
  if(!res.locals.user){
    return res.status(400).redirect("/blogs/create")
  }
  if (
    (req.body.title && req.body.title.length === 0) ||
    (req.body.snippet && req.body.snippet.length === 0) ||
    (req.body.body && req.body.body.length === 0)
  ) {
    return res.status(400).json({ error: "Invalid blog input" });
  }
  const id = req.params.id;
  Blog.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((result) => {
      res
        .status(200)
        .redirect(`/blogs/${id}`);
    })
    .catch((error)=> {
      res.status(400).json({ error: error.message });
    });
};


module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_update_get,
    blog_update_patch
}