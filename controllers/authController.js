const { User } = require("../config/database");
const passport = require("passport");
const { genPassword } = require("../utils/passwordUtils");

const user_signup = async (req, res, next) => {
  const email = req.body.email;
  if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    ){
    req.flash("error", "Please enter valid email");
    return res.status(400).redirect("/signup");
  }
  const emailExistsInDb = await User.findOne({email: email});
  if (emailExistsInDb) {
    req.flash("error", "Email already in use");
    return res.status(400).redirect("/signup");
  }
  const password = req.body.password;
  if(password.length < 6){
    req.flash("error", "Password not strong enough");
    return res.status(400).redirect("/signup");
  }
  try {
    const { salt, hash } = await genPassword(req.body.password);
    const newUser = new User({
      email: email,
      hash: hash,
      salt: salt,
    });
    newUser.save();
    req.flash("success", "Success! You may log in now.");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const user_login = passport.authenticate("local", { failureRedirect: "/login", successRedirect: "/blogs/create" });

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
