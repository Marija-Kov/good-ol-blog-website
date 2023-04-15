const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let connection;
let mongoServer;


const connectDB = async () => {
  console.log(`connectDB runs`)
  mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri(), {});
};

const closeDB = async () => {
  console.log(`closeDB runs`)
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clearDB = async () => {
  console.log(`clearDB runs`);
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = {
  connectDB,
  closeDB,
  clearDB
}
