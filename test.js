import { app } from "./app.js";
import chai from "chai";
import chaiHttp from "chai-http";
import routeCache from "./routeCache.js";
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;
import testDB from "./config/test/database.js";

let testBlogsArray = [];
let testUsersArray = [];
let testUserPassword = "abc";

before(async () => {
  try {
    await testDB.addTestData(testBlogsArray, testUsersArray);
  } catch (error) {
    console.log(error);
  }
});
afterEach(() => {
  routeCache.flush();
});
after(async () => {
  try {
    await testDB.clearAndCloseDB();
    testBlogsArray = null;
    testUsersArray = null;
    testUserPassword = null;
    agent.close();
  } catch (error) {
    console.log(error);
  }
});

describe("App", () => {
  describe("Blog Routes", () => {
    describe("GET /", () => {
      it("should get the first page of all blogs", (done) => {
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            const newestBlogIndex = testBlogsArray.length - 1;
            const blog = new RegExp(`${testBlogsArray[newestBlogIndex].title}`);
            res.text.should.match(blog);
            res.text.should.match(/scroll-down-pointer/);
            done();
          });
      });
    });

    describe("POST /load-more", () => {
      it("should load more blogs by scrolling down", (done) => {
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            return chai
              .request(app)
              .post("/blogs/load-more")
              .send({ currentPage: 1 })
              .end((err, res) => {
                expect(Boolean(res._body.blogs)).to.be.true;
                done();
              });
          });
      });
    });

    describe("GET /:id", () => {
      it("should display 'Page not found' if the blog with the provided id doesn't exist in the database", (done) => {
        const id = "646724f662dbec59f6fe0c53";
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
        const user = testUsersArray[testUsersArray.length - 1];
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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
        const user = testUsersArray[testUsersArray.length - 1];
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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
        const user = testUsersArray[testUsersArray.length - 1];
        const newBlog = {
          title: "",
          snippet: "faulty blog",
          body: "faulty blog",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post("/blogs")
              .send(newBlog)
              .end((err, res) => {
                res.text.should.match(/title must be 1-50 characters/i);
                return agent.get("/blogs").end((err, res) => {
                  const faultyBlog = new RegExp(`${newBlog.snippet}`);
                  res.text.should.not.match(faultyBlog);
                  done();
                });
              });
          });
      });

      it("should show error and not post a blog if blog post attempt was made with invalid snippet input", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const newBlog = {
          title: "faulty blog",
          snippet: "",
          body: "faulty blog",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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
        const user = testUsersArray[testUsersArray.length - 1];
        const newBlog = {
          title: "faulty blog",
          snippet: "faulty blog",
          body: "",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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

      it("should delete oldest blog if number of blogs in database exceeds the limit", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const oldestBlogId = testBlogsArray[0]._id;
        const oldestBlogTitle = new RegExp(`${testBlogsArray[0].title}`);
        const secondOldestBlogId = testBlogsArray[1]._id;
        const secondOldestBlogTitle = new RegExp(`${testBlogsArray[1].title}`);
        const newBlog = {
          title: "MAX OUT",
          snippet: "MAX OUT",
          body: "MAX OUT",
        };
        agent
          .post("/login")
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post("/blogs")
              .send(newBlog)
              .end((err, res) => {
                return agent.get(`/blogs/${oldestBlogId}`).end((err, res) => {
                  res.text.should.not.match(oldestBlogTitle);
                  res.text.should.match(/page not found/i);
                  return agent
                    .get(`/blogs/${secondOldestBlogId}`)
                    .end((err, res) => {
                      res.text.should.match(secondOldestBlogTitle);
                      done();
                    });
                });
              });
          });
      });

      it("should post a blog that should show on 'all blogs' view given that the input is valid", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const newBlog = {
          title: "new blog title",
          snippet: "new blog snippet",
          body: "new blog body",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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
        const blog = testBlogsArray[testBlogsArray.length - 1];
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
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray[testBlogsArray.length - 1];
        const id = blog._id;
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent.get(`/blogs/update/${id}`).end((err, res) => {
              const prefillTitle = new RegExp(`${blog.title}`);
              const prefillSnippet = new RegExp(`${blog.snippet}`);
              const prefillBody = new RegExp(`${blog.body}`);
              res.text.should.match(prefillTitle);
              res.text.should.match(prefillSnippet);
              res.text.should.match(prefillBody);
              done();
            });
          });
      });
    });

    describe("POST /:id", () => {
      it("should render not-authorized message given that the user is not authorized to post blog updates", (done) => {
        const blog = testBlogsArray[testBlogsArray.length - 1];
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

      it("should show error and not update blog if blog update attempt was made with invalid title", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray[testBlogsArray.length - 1];
        const id = blog._id;
        const blogUpdate = {
          title:
            "Too Long Title sjhfsjhfsjhjhfkjshfsjhfsjdkfhjfhsfjhsdjkfdhsfjkshfjshdfjsdhfskjfsjhdfjskh",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post(`/blogs/${id}`)
              .send(blogUpdate)
              .end((err, res) => {
                res.text.should.match(/title must be 1-50 characters long/i);
                return agent.get(`/blogs/${id}`).end((err, res) => {
                  const oldTitle = new RegExp(`${blog.title}`);
                  res.text.should.match(oldTitle);
                  done();
                });
              });
          });
      });

      it("should show error and not update blog if blog update attempt was made with invalid snippet", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray[testBlogsArray.length - 1];
        const id = blog._id;
        const blogUpdate = {
          title: "New blog title",
          snippet:
            "Too Long Snippet fhsdjfhjhfjkhflashfajkfhfahfhdfkjhaskfjhafjkhafjdfhasjdlfasdkjfhasfhasfhasdlkhfksahfaksjhfjsalhfaskjdhfjkhsafjklhasksjdhfasjkfhaskjfh",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post(`/blogs/${id}`)
              .send(blogUpdate)
              .end((err, res) => {
                res.text.should.match(/snippet must be 1-100 characters long/i);
                return agent.get(`/blogs`).end((err, res) => {
                  const oldSnippet = new RegExp(`${blog.snippet}`);
                  res.text.should.match(oldSnippet);
                  done();
                });
              });
          });
      });

      it("should show error and not update blog if blog update attempt was made with invalid body", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray[testBlogsArray.length - 1];
        const id = blog._id;
        const blogUpdate = {
          title: "New blog title",
          snippet: "New blog snippet",
          body: "",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
          .end((err, res) => {
            return agent
              .post(`/blogs/${id}`)
              .send(blogUpdate)
              .end((err, res) => {
                res.text.should.match(/body must be 1-2000 characters long/i);
                return agent.get(`/blogs/${id}`).end((err, res) => {
                  const oldBody = new RegExp(`${blog.body}`);
                  res.text.should.match(oldBody);
                  done();
                });
              });
          });
      });

      it("should update a blog given that all the input is valid", (done) => {
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray[testBlogsArray.length - 1];
        const id = blog._id;
        const blogUpdate = {
          title: "New blog title",
          snippet: "New blog snippet",
          body: "A full-bodied blog.",
        };
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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
        const blog = testBlogsArray[testBlogsArray.length - 1];
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
        const user = testUsersArray[testUsersArray.length - 1];
        const blog = testBlogsArray.pop();
        const id = blog._id;
        agent
          .post(`/user/login`)
          .send({ email: user.email, password: testUserPassword })
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

    describe("Any blog route", () => {
      it("should send error if the number of requests reaches the limit", (done) => {
        let limit = process.env.TEST_MAX_API_BLOGS_REQS;
        for (let i = 0; i <= limit; ++i) {
          chai
            .request(app)
            .get("/blogs")
            .end((err, res) => {});
        }
        chai
          .request(app)
          .get("/blogs")
          .end((err, res) => {
            res.text.should.match(/too many blog requests/i);
            done();
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
        const user = testUsersArray[testUsersArray.length - 1];
        const input = {
          email: user.email,
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

      it("should render error element given that the email input value is too large", (done) => {
        const input = {
          email: "daredevvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv@mail.yu",
          password: "abcabc",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/signup/i);
            res.text.should.match(/32 characters max/i);
            done();
          });
      });

      it("should render error element given that the password input value is too large", (done) => {
        const input = {
          email: "daredev@mail.yu",
          password: "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdadsd",
        };
        agent
          .post(`/user/signup`)
          .send(input)
          .end((err, res) => {
            expect(res).to.redirectTo(/signup/i);
            res.text.should.match(/32 characters max/i);
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

      it("should delete oldest account if the number of registered users goes over the limit", (done) => {
        const oldestUser = {
          email: testUsersArray[0].email,
          password: testUserPassword,
        };
        const newUser = {
          email: "cecee@mail.yu",
          password: "abcABC123!",
        };
        agent
          .post("/user/signup")
          .send(newUser)
          .end((err, res) => {
            testUsersArray.shift();
            return agent
              .post("/user/login")
              .send(oldestUser)
              .end((err, res) => {
                expect(res).to.redirectTo(/login/i);
                res.text.should.match(
                  /please enter email you have signed up with/i
                );
                done();
              });
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
            res.text.should.match(
              /please enter email you have signed up with/i
            );
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
          email: testUsersArray[0].email,
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
          email: testUsersArray[0].email,
          password: testUserPassword,
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res).to.redirectTo(/blogs\/create/i);
            res.text.should.match(/log out/i);
            done();
          });
      });
    });

    describe("GET /user/logout", () => {
      it("should redirect and render logged-out navbar given that the user logged out successfully", (done) => {
        const user = testUsersArray[0];
        const credentials = {
          email: user.email,
          password: testUserPassword,
        };
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            return agent.get("/user/logout").end((err, res) => {
              expect(res).to.redirect;
              res.text.should.match(/log in/i);
              done();
            });
          });
      });
    });

    describe("Any user route", () => {
      it("should send error if the number of requests reaches the limit", (done) => {
        const credentials = {
          email: "some@email.yu",
          password: "abcABC123!",
        };
        const limit = process.env.TEST_MAX_API_USER_REQS;
        for (let i = 0; i <= limit; ++i) {
          agent
            .post(`/user/login`)
            .send(credentials)
            .end((err, res) => {});
            routeCache.flush()
        }
        agent
          .post(`/user/login`)
          .send(credentials)
          .end((err, res) => {
            res.text.should.match(/too many login\/signup requests/i);
            done();
          });
      });
    });
  });

  describe("About route", () => {
    describe("GET /about", () => {
      it("should render 'about' view", (done) => {
        chai
          .request(app)
          .get("/about")
          .end((err, res) => {
            res.text.should.match(/about us/i);
            done();
          });
      });
    });
  });

  describe("404 route", () => {
    it("should render Page Not Found if the route doesn't exist", (done) => {
      chai
        .request(app)
        .get("/somepage")
        .end((err, res) => {
          res.text.should.match(/not found/i);
          done();
        });
    });
  });
});
