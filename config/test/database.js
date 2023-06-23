import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userSchema from "../../schemas/user.js";
import blogSchema from "../../schemas/blog.js";

const mongoServer = await MongoMemoryServer.create();
const connection = mongoose.createConnection(mongoServer.getUri())
const User = connection.model("User", userSchema);
const Blog = connection.model("Blog", blogSchema);

const addTestData = async (testBlogsArray, testUsersArray) => {
  const maxBlogsLimit = process.env.TEST_MAX_BLOGS_LIMIT;
  const maxUsersLimit = process.env.TEST_MAX_USERS_LIMIT;
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

const clearAndCloseDB = async () => {
  console.log(`clearAndCloseDB runs`);
  for (const key in connection.collections) {
    await connection.collections[key].deleteMany({});
  }
  await connection.dropDatabase();
  await connection.close();
  await mongoServer.stop();
};

const testDB = {
  connection,
  User,
  Blog,
  addTestData,
  clearAndCloseDB
}

export default testDB
