const User = require("../models/user");
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const user_login = async (req, res) => {
  const { email, password } = req.body;
  try {
   const user = await User.login(email, password); 
   const id = user._id;
   const token = createToken(id);
   const accountType = user.accountType;
   res.status(200).json({ token, accountType, redirect: "/blogs" })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
    user_login
}
