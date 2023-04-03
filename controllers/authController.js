const User = require("../models/user");
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const user_login = async (req, res) => {
  const { email, password } = req.body;
  try {
   const user = await User.login(email, password); 
   res
     .status(200)
     .cookie("id", user._id, {
       path: "/",
       domain: process.env.DOMAIN,
       expires: new Date(Date.now() + 900000),
       httpOnly: true,
       secure: true,
       sameSite: "strict"
     })
     .cookie("accountType", user.accountType, {
       path: "/",
       domain: process.env.DOMAIN,
       expires: new Date(Date.now() + 900000),
       httpOnly: true,
       secure: true,
       sameSite: "strict"
     })
     .redirect("/");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const user_logout = async (req, res) => {
 try {
  res
    .status(200)
    .clearCookie("id")
    .clearCookie("accountType")
    .redirect("/");  
 } catch (error) {
  res.status(400).json({ error: error.message });
 }
}

module.exports = {
    user_login,
    user_logout
}
