const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userSchema = require("../../models/user");
const blogSchema = require("../../models/blog");

let connection;
let mongoServer;
let User;
let Blog;

const connectDB = async () => {
  console.log(`connectDB runs`)
  mongoServer = await MongoMemoryServer.create();
  connection = await mongoose.connect(mongoServer.getUri(), {});
  User = connection.model("User", userSchema);
  Blog = connection.model("Blog", blogSchema);
};

const addTestData = async (testBlogsArray, testUsersArray, User, Blog) => {
  const maxBlogsLimit = 20;
  const maxUsersLimit = 5;
    for (let i = 0; i < maxBlogsLimit-1; ++i) {
      const testBlog = new Blog({
        title: `TEST title ${i + 1}`,
        snippet: `TEST snippet ${i + 1}`,
        body: `TEST body ${i + 1}`,
      });
      testBlogsArray.push(await testBlog.save());
    }
    for (let i = 0; i < maxUsersLimit - 1; ++i) {
      const testUser = new User({
        email: `poozh${i}@mail.yu`,
        hash: "$2b$12$HY8HDZvY9.TbJ7aa8JckXuYXPBQ5LCQib6wnW78G.2HgHWE0.naWS",
        salt: "$2b$12$HY8HDZvY9.TbJ7aa8JckXu",
      });
      testUsersArray.push(await testUser.save());
    }
}

const clearDB = async () => {
  console.log(`clearDB runs`);
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

const closeDB = async () => {
  console.log(`closeDB runs`)
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};


module.exports = {
  addTestData,
  connectDB,
  closeDB,
  clearDB
}
