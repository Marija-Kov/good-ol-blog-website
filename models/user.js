const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");


const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  accountType: {
    type: String,
    enum: ["admin", "other"],
    default: "admin",
  },
});

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required");
  }
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    throw Error("Invalid email address");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("That email does not exist in our database");
  }

  // const match = await bcrypt.compare(password, user.password);
  // if (!match) {
  //   throw Error("Wrong password");
  // }
 
  if(password !== user.password){
    throw Error("Wrong password");
  }

  return user;
};

const User = mongoose.model("User",userSchema); 
module.exports = User