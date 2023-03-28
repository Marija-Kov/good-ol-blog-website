const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
const chaiHttp = require('chai-http');

const Blog = require('./models/blog');
const app = require('./app.js');

chai.use(chaiHttp);

//clean up the DB before and after testing in the name of good practice
// before((done) => {
//      Blog.deleteMany({}, function(error){})
//      done()
// });
// after((done)=> {
//     Blog.deleteMany({}, function (error){});
//     done();
// })

describe('App', () => {
     it("should get all blogs", (done) => {
       chai.request(app)
       .get('/blogs')
       .end((err, res)=>{
            res.should.have.status(200);
            res.body.should.be.a("array"); // for res.body to work, there needs to be a res.send(result) in the controller
            //res.body.length.should.be.eql(0)
        done()     
       })
     });
     it("should get a blog by id", (done) => {
      const id = "63d8b19dacc772c7dff32889";   
      chai.request(app)
      .get(`/blogs/${id}`)
      .end((err, res) => {
       res.should.have.status(200); 
       res.body.should.be.a("object");
       res.body._id.length.should.be.eql(24)
       done()
      })
     });
     it("should post a valid blog", (done) => {
          let blog = {
               title: "blog title",
               snippet: "blog snippet",
               body: "blog body"
            };

          chai.request(app)
          .post('/blogs')
          .send(blog)
          .end((err, res)=>{
               res.should.have.status(200);
               res.body.should.be.a('object')
               done()
          })
        })
          it("should update a blog", (done) => {
            let id = "63d8e31fc8a7e164d9a2bd3c";
            let blog = {
              body: "YYYYYYYYYYYYYYY",
            };
            chai
              .request(app)
              .patch(`/blogs/${id}`)
              .send(blog)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.body.should.be.eql(blog.body);
                done();
              });
          });
          it("should delete a blog", (done) => {
            let id = "63d8b122791eee50f3d5d740";
            chai
              .request(app)
              .delete(`/blogs/${id}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                done();
              });
          });

})

