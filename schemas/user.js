import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  hash: String,
  salt: String,
  accountType: {
    type: String,
    enum: ["admin", "other"],
    default: "admin",
  },
});


export default userSchema;