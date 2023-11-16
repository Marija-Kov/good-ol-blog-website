import passport from "passport";
import { verifyPassword } from "../utils/passwordUtils.js";
import * as passportLocal from "passport-local";
import { wss } from "../app.js";
const LocalStrategy = passportLocal.Strategy;

let User;

if (process.env.NODE_ENV !== "test") {
  import("../config/database.js")
    .then((db) => {
      User = db.default.User;
    })
    .catch((error) => console.log(error));
} else {
  import("../config/test/database.js")
    .then((db) => {
      User = db.default.User;
    })
    .catch((error) => console.log(error));
}

const customFields = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

const verifyCallback = async (req, email, password, done) => {
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    )
  ) {
    req.flash("error", "⚠Please enter a valid email");
    return done(null, false);
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "⚠Please enter email you have signed up with");
      return done(null, false);
    }
    const isValid = await verifyPassword(password, user.hash, user.salt);
    if (isValid) {
      wss.clients.forEach((client) => {
        client.send(`🔑 ${user.email} logged in`);
      });
      return done(null, user);
    } else {
      req.flash("error", "⚠Wrong password");
      return done(null, false);
    }
  } catch (error) {
    done(error);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
