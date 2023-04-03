const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');

const db = require("./config/test/database.config");
const Blog = require('./models/blog');
const User = require("./models/user");
const app = require('./app.js');

chai.use(chaiHttp);

let testBlogsArray = []
let testUser;
before(async () => {
await db.connect()
  for(let i = 0; i < 3; ++i){
   const testBlog = new Blog({
     title: `blog title ${i + 1}`,
     snippet: `blog snippet ${i + 1}`,
     body: `blog body ${i + 1}`,
   });
   testBlogsArray.push(await testBlog.save())
 } 
testUser = await new User({
  email: "poozh@mail.yu",
  password: "abcABC123!"
 }).save();
});

after(async ()=> {
   await db.clear()
   await db.close()
   testBlogsArray = [];
   testUser=null;
})

describe("App", () => {
  describe("blogController", () => {
    describe("/GET blog(s)", () => {
      it("should get all blogs", (done) => {
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            res.should.have.status(200);
            res.text.should.match(/all blogs/i);
            done();
          });
      });

      it("should respond with status 404 if the blog with the provided id doesn't exist in the database", (done) => {
        const id = "11";
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            res.should.have.status(404);
            res.text.should.match(/page not found/i);
            done();
          });
      });

      it("should get a blog by id given that it exists in the database", (done) => {
        const blog = testBlogsArray[0]
        const id = blog._id;
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            const blogFound = new RegExp(`${blog.body}`)
            res.should.have.status(200);
            res.text.should.match(blogFound);
            done();
          });
      });
    });

    describe("/POST", () => {
      it("should respond with status 400 if blog post attempt was made with invalid input", (done) => {
        let blog = {
          title: "faulty blog",
          snippet: "faulty blog",
          body: "",
        };
        chai
          .request(app)
          .post("/blogs")
          .send(blog)
          .end((err, res) => {
            res.should.have.status(400);
          });
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            res.text.should.not.match(/faulty blog/i);
            done();
          });
      });

      it("should post a blog given that the input is valid", (done) => {
        let newBlog = {
          title: "new blog title",
          snippet: "new blog snippet",
          body: "new blog body",
        };

        chai
          .request(app)
          .post("/blogs")
          .send(newBlog)
          .end((err, res) => {
            res.should.have.status(200);
            assert.exists(res.body._id);
          });
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            const blogPosted = new RegExp(`${newBlog.title}`)
            res.text.should.match(blogPosted);
            done();
          });
      });
    });

    describe("/PATCH", () => {
      it("should respond with status 400 if blog update attempt was made with invalid input", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        const blogUpdate = { body: "" };
        chai
          .request(app)
          .patch(`/blogs/${id}`)
          .send(blogUpdate)
          .end((err, res) => {
            res.should.have.status(400);
          });
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            const oldBody = new RegExp(`${blog.body}`);
            res.should.have.status(200);
            res.text.should.match(oldBody);
            done();
          });
      });

      it("should update a blog given that all the input is valid", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        const blogUpdate = {
          body: "A full-bodied blog.",
        };
        chai
          .request(app)
          .patch(`/blogs/${id}`)
          .send(blogUpdate)
          .end((err, res) => {
            res.should.have.status(200);
          });
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            const updatedBlog = new RegExp(`${blogUpdate.body}`);
            res.text.should.match(updatedBlog);
            done();
          });
      });
    });

    describe("/DELETE a blog", () => {
      it("should delete a blog given that the blog with the provided id was found", (done) => {
        const blog = testBlogsArray.pop();
        const id = blog._id;
        chai
          .request(app)
          .delete(`/blogs/${id}`)
          .end((err, res) => {
            res.should.have.status(200);
          });
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            const deletedBlog = new RegExp(`${blog.title}`);
            res.text.should.not.match(deletedBlog);
            done();
          });
      });
    });
  });
  describe.only("authController", () => {
     describe("/POST - user login", () => {
      it("should respond with status 400 given that user credentials are invalid", (done) => {
        const credentials = {
          email: testUser.email, password: "abcAB"
        }
        chai
         .request(app)
         .post(`/user/login`)
         .send(credentials)
         .end((err, res) => {
          res.should.have.status(400);     
          done()
         })

      });
      it("should respond with status 200 given that user credentials are valid", (done) => {
        const credentials = {
          email: testUser.email, password: testUser.password
        }
        chai
         .request(app)
         .post(`/user/login`)
         .send(credentials)
         .end((err, res) => {
          console.log(res);
          res.should.have.status(200);  
          res.text.should.match(/all blogs/i); 
          done()
         })

      })
     });
     describe("/GET - user logout", () => {
      it("should respond with status 200 given that the user logged out successfully", (done) => {
        chai
         .request(app)
         .get(`/user/logout`)
         .end((err, res) => {
          res.should.have.status(200);
          res.text.should.match(/log in/i);  
          res.text.should.match(/all blogs/i);     
          done()
         })

      })
     })
  })
});
