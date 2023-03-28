const Blog = require("../models/blog");

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(result => {
      res
        //.send(result) // <-- uncomment this for testing and comment every other method out 
          .status(200)
          .render("blogs/index", { title: "All Blogs", blogs: result });
    })
    .catch(error=> {
      res.status(400).json({ error: err.message });
      console.log(`Error: ${error}`);
    });
};
   
const blog_details = (req, res) => {
   const id = req.params.id;
   Blog.findById(id)
     .then(result => {
       res
         //.send(result)
         .status(200)
         .render("blogs/details", { blog: result, title: "Blog Details" });
     })
     .catch(error=> {
       res.status(404).render("404", { title: "Page Not Found", message: err.message });
     }); 
};

const blog_create_get = (req, res) => {
  res.status(200).render("blogs/create", { title: "Create" });

};

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  const id = req.params.id;
  blog
    .save()
    .then(result => {
      res
        //.send(result)
        .status(200)
        .redirect("/blogs");
    })
    .catch((error)=> {
      res.status(400).json({ error: err.message });
      console.log(`Error: ${error}`);
    });
};

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res
        //.send(result)
        .status(200)
        .json({ redirect: "/blogs" });
    })
    .catch((error)=> {
      res.status(400).json({ error: err.message });
      console.log(`Error: ${error}`);
    });
};

const blog_update_get = (req, res) => { 
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
         .render("404", { title: "Page Not Found", message: err.message });
     }); 
};

const blog_update_patch = (req, res) => {
  const id = req.params.id;
  Blog.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((result) => {
      res
        //.send(result)
        .status(200)
        .json({ redirect: `/blogs/${id}` });
    })
    .catch((error)=> {
      res.status(400).json({ error: err.message });
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