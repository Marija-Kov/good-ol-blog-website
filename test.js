const app = require('./app.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const db = require("./config/test/database.config");
const Blog = require('./models/blog');
const User = require("./models/user");

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
   agent.close()
})

describe("App", () => {
  describe("Blog Routes", () => {
    describe("GET /", () => {
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
    });

    describe("GET /:id", () => {
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

      it("shouldn't render 'delete' and 'edit' buttons on blog details view given that the user is not authorized", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id; 
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
           res.text.should.not.match(/edit/i);
           res.text.should.not.match(/delete/i);
           done() 
          })
      });

      it("should render 'delete' and 'edit' buttons on blog details view given that the user is authorized", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        agent
          .get(`/blogs/${id}`)
          .set("Cookie", "mockAuthCookie")
          .end((err, res) => {
            res.text.should.match(/edit/i);
            res.text.should.match(/delete/i);
            done();
          });
         
      })
      
    })
  
    describe("GET /create", () => {
      it("should render not-authorized message given that the user is not authorized to access blogs/create view", (done) => {
         chai
           .request(app)
           .get("/blogs/create")
           .end((err, res) => {
             res.text.should.match(/not authorized/i);
             done();
           });
      });
      it("should render an empty blog form given that the user is authorized to access blogs/create view", (done) => {
            agent
              .get(`/blogs/create`)
              .set("Cookie", "mockAuthCookie")
              .end((err, res) => {
                res.text.should.match(/blog title/i);
                res.text.should.match(/blog snippet/i);
                res.text.should.match(/blog body/i);
                done();
              });
       //   });
      });
    })

    describe("POST /", () => {
      it("should render not-authorized message given that the user is not authorized to post a new blog", (done) => {
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
            res.text.should.match(/not authorized/i);
            done();
          });
      });

      it("should respond with status 400 if blog post attempt was made with invalid input", (done) => {
        let blog = {
          title: "faulty blog",
          snippet: "faulty blog",
          body: "",
        };
        chai
          .request(app)
          .post("/blogs")
          .set("Cookie", "mockAuthCookie")
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
          .set("Cookie", "mockAuthCookie")
          .send(newBlog)
          .end((err, res) => {
            res.should.have.status(200);
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

    describe("GET /update/:id", () => {
      it("should render not-authorized message given that the user is not authorized to access blogs/update view", (done) => {
         const blog = testBlogsArray[0];
         const id = blog._id;
         chai
           .request(app)
           .get(`/blogs/update/${id}`)
           .end((err, res) => {
             res.text.should.match(/not authorized/i);
             done();
           });
      });

      it("should render a blog form prefilled with the existing blog content given that the user is authorized to access blogs/update view", (done) => {
        const blog = testBlogsArray[0];
         const id = blog._id;
         chai
           .request(app)
           .get(`/blogs/update/${id}`)
           .set("Cookie", "mockAuthCookie")
           .end((err, res) => {
             const prefill = new RegExp(`${blog.title}`);
             res.text.should.match(prefill);
             done();
           });
      });
    })

    describe("POST /:id", () => {
      it("should render not-authorized message given that the user is not authorized to post blog updates", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
         const blogUpdate = {
           body: "A full-bodied blog.",
         };
         chai
           .request(app)
           .post(`/blogs/${id}`)
           .send(blogUpdate)
           .end((err, res) => {
             res.text.should.match(/not authorized/i);
             done();
           });
      });

      it("should respond with status 400 if blog update attempt was made with invalid input", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        const blogUpdate = { body: "" };
        chai
          .request(app)
          .post(`/blogs/${id}`)
          .set("Cookie", "mockAuthCookie")
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
          .post(`/blogs/${id}`)
          .set("Cookie", "mockAuthCookie")
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

    describe("GET /delete/:id", () => {
      it("should render not-authorized message given that the user is not authorized to delete blogs", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
         chai
           .request(app)
           .get(`/blogs/delete/${id}`)
           .end((err, res) => {
             res.text.should.match(/not authorized/i);
             done();
           });
      });

      it("should delete a blog given that the blog with the provided id was found", (done) => {
        const blog = testBlogsArray.pop();
        const id = blog._id;
        chai
          .request(app)
          .get(`/blogs/delete/${id}`)
          .set("Cookie", "mockAuthCookie")
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

  describe("User routes", () => {
     describe("POST /user/login", () => {
      it("should respond with status 400 given that user credentials are invalid", (done) => {
        const credentials = {
          email: testUser.email, password: "abcAB"
        }
        chai
          .request(app)
          .post(`/user/login`)
          .send(credentials)
          .set("Cookie", "mockAuthCookie")
          .end((err, res) => {
            res.should.have.status(400);
            res.text.should.not.match(/log out/i);
            done();
          });

      });
      it("should respond with status 200 given that user credentials are valid", (done) => {
        const credentials = {
          email: testUser.email, password: testUser.password
        }
        chai
         .request(app)
         .post(`/user/login`)
         .send(credentials)
         .set("Cookie", "mockAuthCookie")
         .end((err, res) => {
          res.should.have.status(200);  
          res.text.should.match(/log out/i); 
          done()
         })
      })
     });
     describe("GET /user/logout", () => {
      it("should respond with status 200 given that the user logged out successfully", (done) => {
        const credentials = {
          email: testUser.email, password: testUser.password
        }
        chai
         .request(app)
         .post(`/user/login`)
         .send(credentials)
         .set("Cookie", "mockAuthCookie")
         .end((err, res) => {
          res.text.should.match(/log out/i);  
          return chai
            .request(app)
            .get("/user/logout")
            .end((err, res) => {
              expect(res).to.redirect;
              done();
            });
       
         })
      })
     })
  })
});
