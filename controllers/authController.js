import passport from "passport";
import { genPassword } from "../utils/passwordUtils.js";
let User;

if(process.env.NODE_ENV !== "test"){
  import("../config/database.js").then(db => {
   User = db.default.User
  }).catch(error => console.log(error))
} else {
  import("../config/test/database.js").then(db => {
   User = db.default.User
  }).catch(error => console.log(error));
}

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

  User.find()
     .then((users) => {
       if (users.length >= 5) {
         const id = users[0]._id;
         User.findByIdAndDelete(id)
           .then((result) => {
             res.status(200);
           })
           .catch((error) => {
             res.status(400).json({ error: error.message });
             console.log(error.message)
           });
       }
     })
     .catch((error) => {
       res.status(400).json({ error: error.message });
       console.log(error.message);
     });

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

export default {
  user_login,
  user_logout,
  user_signup
};
