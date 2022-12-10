const Blog = require("../models/blog");

const blog_index = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(result => {
      res.render("blogs/index", { title: "All Blogs", blogs: result });
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};
   
const blog_details = (req, res) => {
   const id = req.params.id;
   Blog.findById(id)
     .then(result => {
       res.render("blogs/details", { blog: result, title: "Blog Details" });
     })
     .catch(err => {
       res.status(404).render("404", { title: "Error" });
     }); 
};

const blog_create_get = (req, res) => {
 res.render("blogs/create", { title: "Create" });

};

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  const id = req.params.id;
  blog
    .save()
    .then(result => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
};

const blog_delete = (req, res) => {
const id = req.params.id;
Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: "/blogs" }); 
    // CAN'T use .redirect() NodeJS method here! - 
    // send JSON with redirect property with the URL as value
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
};

const blog_update_get = (req, res) => { 
  const id = req.params.id;
  Blog.findById(id)
     .then(result => {  
       // The result is blog object that needs to be passed as a value to the "blog" key.. 
       // ..so the view that uses it is granted access to its properties.
       res.render("blogs/update", { blog: result, title: "Update Blog" });
     })
     .catch(err => {
       res.status(404).render("404", { title: "Error" });
     }); 
};

const blog_update_patch = (req, res) => {
const id = req.params.id;
Blog.findOneAndUpdate({_id: id}, req.body, {new: true, runValidators: true})
.then(result => {
  // console.log(`result ${result}`)
  res.json({ redirect: `/blogs/${id}`})
})
.catch(err => {
       res.status(404).render("404", { title: "Error" });
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