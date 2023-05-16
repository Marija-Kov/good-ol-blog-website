const app = require("./app.js");

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;

const { connectDB, closeDB, clearDB } = require("./config/test/database.js");

const { connection, User, Blog } = require("./config/database")

let testBlogsArray;
let testUser;
let testUserPassword = "abc";

before(async () => {
  try {
    testBlogsArray = [];
    for (let i = 0; i < 3; ++i) {
      const testBlog = new Blog({
        title: `TEST title ${i + 1}`,
        snippet: `TEST snippet ${i + 1}`,
        body: `TEST body ${i + 1}`,
      });
      testBlogsArray.push(await testBlog.save());
    }
    testUser = await new User({
      email: "poozh@mail.yu",
      hash: "$2b$12$HY8HDZvY9.TbJ7aa8JckXuYXPBQ5LCQib6wnW78G.2HgHWE0.naWS",
      salt: "$2b$12$HY8HDZvY9.TbJ7aa8JckXu",
    }).save();
  } catch (error) {
    console.log(error);
  }
});

after(async () => {
  try {
    for (const key in connection.collections) {
      await connection.collections[key].deleteMany({});
    }
     await connection.dropDatabase();
    await connection.close();
    testBlogsArray = null;
    testUser = null;
    testUserPassword = null;
    agent.close();
  } catch (error) {
    console.log(error);
  }
});

describe("App", () => {
  describe("Blog Routes", () => {
    describe("GET /", () => {
      it("should get all blogs", (done) => {
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            res.text.should.match(/all blogs/i);
            const blog = new RegExp(`${testBlogsArray[0].title}`);
            res.text.should.match(blog);
            done();
          });
      });
    });

    describe("GET /:id", () => {
      it("should display 'Page not found' if the blog with the provided id doesn't exist in the database", (done) => {
        const id = "11";
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            res.text.should.match(/page not found/i);
            done();
          });
      });

      it("should show blog details given that the blog exists in the database", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        chai
          .request(app)
          .get(`/blogs/${id}`)
          .end((err, res) => {
            const blogFound = new RegExp(`${blog.body}`);
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
            done();
          });
      });

      it("should render 'delete' and 'edit' buttons on blog details view given that the user is authorized", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
         agent
           .post(`/user/login`)
           .send({ email: testUser.email, password: testUserPassword })
           .end((err, res) => {
             return agent.get(`/blogs/${id}`).end((err, res) => {
               res.text.should.match(/edit/i);
               res.text.should.match(/delete/i);
               done();
             });
           });
        
      });
    });

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
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            res.text.should.match(/blog title/i);
            res.text.should.match(/blog snippet/i);
            res.text.should.match(/blog body/i);
            done();
          });
      });
    });

    describe("POST /", () => {
      it("should render 'not-authorized' message given that the user is not authorized to post a new blog", (done) => {
        const newBlog = {
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

      it("should show error and not post a blog if blog post attempt was made with invalid title input", (done) => {
        const newBlog = {
          title: "",
          snippet: "faulty blog",
          body: "faulty blog",
        };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
             .post("/blogs")
             .send(newBlog)
             .end((err, res) => {
              res.text.should.match(/title must be 1-50 characters/i);
              return agent
                .get("/blogs")
                .end((err, res) => {
                 const faultyBlog = new RegExp(`${newBlog.snippet}`);
                 res.text.should.not.match(faultyBlog);
                 done();
                });
             });
          })
        
      });

      it("should show error and not post a blog if blog post attempt was made with invalid snippet input", (done) => {
        const newBlog = {
          title: "faulty blog",
          snippet: "",
          body: "faulty blog",
        };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post("/blogs")
              .send(newBlog)
              .end((err, res) => {
               res.text.should.match(/snippet must be 1-100 characters/i); 
                return agent.get("/blogs").end((err, res) => {
                  const faultyBlog = new RegExp(`${newBlog.title}`);
                  res.text.should.not.match(faultyBlog);
                  done();
                });
              });
          });
      });

      it("should show error and not post a blog if blog post attempt was made with invalid body input", (done) => {
        const newBlog = {
          title: "faulty blog",
          snippet: "faulty blog",
          body: "",
        };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post("/blogs")
              .send(newBlog)
              .end((err, res) => {
                res.text.should.match(/body must be 1-2000 characters/i);
                return agent.get("/blogs").end((err, res) => {
                  const faultyBlog = new RegExp(`${newBlog.title}`);
                  res.text.should.not.match(faultyBlog);
                  done();
                });
              });
          });
      });

      it("should post a blog that should show on 'all blogs' view given that the input is valid", (done) => {
        const newBlog = {
          title: "new blog title",
          snippet: "new blog snippet",
          body: "new blog body",
        };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post("/blogs")
              .send(newBlog)
              .end((err, res) => {
                return agent.get("/blogs").end((err, res) => {
                  const blogPosted = new RegExp(`${newBlog.title}`);
                  res.text.should.match(blogPosted);
                  done();
                });
              });
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
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => { 
            return agent
             .get(`/blogs/update/${id}`)
             .end((err, res) => {
              const prefillTitle = new RegExp(`${blog.title}`);
              const prefillSnippet = new RegExp(`${blog.snippet}`);
              const prefillBody = new RegExp(`${blog.body}`);
              res.text.should.match(prefillTitle);
              res.text.should.match(prefillSnippet);
              res.text.should.match(prefillBody);
              done();
             });
          })
      });
    });

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

      it("should not update blog if blog update attempt was made with invalid input", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        const blogUpdate = { body: "" };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post(`/blogs/${id}`)
              .send(blogUpdate)
              .end((err, res) => {
                return agent.get(`/blogs/${id}`).end((err, res) => {
                  const oldBody = new RegExp(`${blog.body}`);
                  res.text.should.match(oldBody);
                  done();
                });
              });
          });
      });

      it("should update a blog given that all the input is valid", (done) => {
        const blog = testBlogsArray[0];
        const id = blog._id;
        const blogUpdate = {
          body: "A full-bodied blog.",
        };
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post(`/blogs/${id}`)
              .send(blogUpdate)
              .end((err, res) => {
                return agent.get(`/blogs/${id}`).end((err, res) => {
                  const updatedBlog = new RegExp(`${blogUpdate.body}`);
                  res.text.should.match(updatedBlog);
                  done();
                });
              });
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
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent.get(`/blogs/delete/${id}`).end((err, res) => {
              return agent.get("/blogs").end((err, res) => {
                const deletedBlog = new RegExp(`${blog.title}`);
                res.text.should.not.match(deletedBlog);
                done();
              });
            });
          });
      });
    });
  });

  describe("User routes", () => {
    describe("POST /user/signup", () => {
      it("should render error element given that email input value is invalid", (done) => {
        const input = {
          email: "keech",
          password: "abcABC123!",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/signup/i);
            res.text.should.match(/please enter valid email/i);
            done();
          });
      });

      it("should render error element given that email already exists in the database", (done) => {
        const input = {
          email: testUser.email,
          password: "abcABC123!",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/signup/i);
            res.text.should.match(/already in use/i);
            done();
          });
      });

      it("should render error element given that the password is not strong enough", (done) => {
        const input = {
          email: "daredev@mail.yu",
          password: "a",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/signup/i);
            res.text.should.match(/not strong enough/i);
            done();
          });
      });

      it("should redirect to login view and show success message given that input is valid", (done) => {
        const input = {
          email: "sorkor@pimpim.pij",
          password: "abcABC123!",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/login/i);
            res.text.should.match(/success/i);
            done();
          });
      });
    });

    describe("POST /user/login", () => {
      it("should render error element given that email doesn't exist in the database", (done) => {
        const credentials = {
          email: "some@email.yu",
          password: "abcABC123!",
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            expect(res).to.redirectTo(/login/i);
            res.text.should.match(/please enter email you have signed up with/i);
            done();
          });
      });

      it("should render error element given that email input value is invalid", (done) => {
        const credentials = {
          email: "sorkor",
          password: "abcABC123!",
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            expect(res).to.redirectTo(/login/i);
            res.text.should.match(/Please enter a valid email/i);
            done();
          });
      });

      it("should render error element given that the password is wrong", (done) => {
        const credentials = {
          email: "sorkor@pimpim.pij",
          password: "ab",
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            expect(res).to.redirectTo(/login/i);
            res.text.should.match(/wrong password/i);
            done();
          });
      });

      it("should redirect to a protected view given that user credentials are valid", (done) => {
        const credentials = {
          email: "sorkor@pimpim.pij",
          password: "abcABC123!",
        };
          agent 
            .post(`/user/login`)
            .send(credentials)
            .end((err, res) => {
              res.should.have.status(200);
              expect(res).to.redirectTo(/blogs\/create/i);
              res.text.should.match(/log out/i);
              done()
            });
      });
    });

    describe("GET /user/logout", () => {
      it("should redirect and render logged-out navbar given that the user logged out successfully", (done) => {
        const credentials = {
          email: testUser.email,
          password: testUserPassword,
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            return agent
              .get("/user/logout")
              .end((err, res) => {
                expect(res).to.redirect;
                res.text.should.match(/log in/i);
                done();
              });
          });
      });
    });
  });

  describe("About route", () => {
    describe("GET /about", () => {
      it("should show unauthorized user version of the about view given that the user isn't authorized", (done) => {
        chai
          .request(app)
          .get("/about")
          .end((err, res) => {
            res.text.should.match(/about us/i);
            res.text.should.not.match(/edit/i);
            done();
          });
      });

      it("should show authorized user version of the about view given that the user is authorized", (done) => {
        agent
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUserPassword })
          .end((err, res) => {
            return agent.get("/about").end((err, res) => {
              res.text.should.match(/about us/i);
              res.text.should.match(/edit/i);
              done();
            });
          });
      });
    });

  })

  describe("404 route", ()=> {
    it("should render Page Not Found if the route doesn't exist", (done)=> {
      chai
      .request(app)
      .get('/somepage')
      .end((err, res) => {
        res.text.should.match(/doesn't exist/i)
        done()
      })
    })
  })

});
