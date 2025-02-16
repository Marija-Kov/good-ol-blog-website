import passport from "passport";
import { genPassword } from "../utils/passwordUtils.js";
import { wss } from "../app.js";
import User from "../data-access-layer/userRepository.js"

const user_signup = async (req, res, next) => {
  const email = req.body.email;
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    req.flash("error", "⚠Please enter valid email");
    return res.status(400).redirect("/signup");
  }
  if (email.length > 32) {
    req.flash("error", "⚠Email too long, 32 characters max");
    return res.status(400).redirect("/signup");
  }
  const emailExistsInDb = await User.find({ email });
  if (emailExistsInDb) {
    req.flash("error", "⚠Email already in use");
    return res.status(400).redirect("/signup");
  }
  const password = req.body.password;
  if (password.length < 6) {
    req.flash("error", "⚠Password not strong enough");
    return res.status(400).redirect("/signup");
  }
  if(!password.match(/^[^\s]+$/)) {
    req.flash("error", "⚠Password must not contain spaces");
    return res.status(400).redirect("/signup");
  }
  if (password.length > 32) {
    req.flash("error", "⚠Password too long, 32 characters max");
    return res.status(400).redirect("/signup");
  }

  const maxUsers =
    process.env.NODE_ENV !== "test"
      ? process.env.MAX_USERS_LIMIT
      : process.env.TEST_MAX_USERS_LIMIT;
  User.find()
    .then((users) => {
      if (users.length >= maxUsers) {
        const id = users[0]._id;
        User.delete(id)
          .then((result) => {
            res.status(200);
            wss.clients.forEach((client) => {
              client.send(`♻️ Users maxed out, removed user ${result.email}`);
            });
          })
          .catch((error) => {
            res.status(400).json({ error: error.message });
            console.log(error.message);
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
      console.log(error.message);
    });

  try {
    const { salt, hash } = await genPassword(req.body.password);
    await User.create(email, hash, salt);
    wss.clients.forEach((client) => {
      client.send(`👤 New user signed up ${email}`);
    });
    req.flash("success", "Success! You may log in now.");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const user_login = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/blogs/create",
});

const user_logout = (req, res, next) => {
  req.logout((err) => {
    wss.clients.forEach((client) => {
      client.send(`🔑 Someone logged out`);
    });
    if (err) {
      next(err);
    }
    res.redirect("/login");
  });
};

export default {
  user_login,
  user_logout,
  user_signup,
};
