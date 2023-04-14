const { User } = require("../config/database");
const passport = require("passport");
const { genPassword } = require("../utils/passwordUtils");

const user_signup = async (req, res, next) => {
  const email = req.body.email;
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    return res.status(400).send("Invalid email address");
  }
  if(await User.findOne({email: email})){
    return res.status(400).send("Email already in use");
  }
  const password = req.body.password;
  if(password.length < 6){
    return res.status(400).send("Password not strong enough");
  }
  try {
    const { salt, hash } = await genPassword(req.body.password);
    const newUser = new User({
      email: email,
      hash: hash,
      salt: salt,
    });
    newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const user_login = passport.authenticate("local", {failureRedirect: '/404', successRedirect:'/blogs/create'});

const user_logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/login");
    })
}

module.exports = {
  user_login,
  user_logout,
  user_signup
};
