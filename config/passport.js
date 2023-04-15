const passport = require("passport");
const { verifyPassword } = require("../utils/passwordUtils");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require('./database');

// to verify credentials, passport will look for "username" and "password" literally, but this can be modified
// by setting up custom fields:
const customFields = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}

const verifyCallback = async (req, email, password, done) => { // done is a function you eventually pass the result of your auth to
   if (!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    ) {
      req.flash("error", "Please enter a valid email");
      return done(null, false);
    } 
   try {
   const user = await User.findOne({ email: email });
   if(!user){ 
      req.flash("error", "Please enter email you have signed up with");
      return done(null, false) // arguments: error, response
   }
   const isValid = await verifyPassword(password, user.hash, user.salt);
   if(isValid){ 
      return done(null, user)
   } else {
      req.flash("error", "Wrong password");
      return done(null, false)
   }   
 } catch (error) {
    done(error);
 }
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy)

// here passport takes the user from the db 
// and puts it in the Express session on the request object
passport.serializeUser((user, done) => {
 done(null, user.id)
});

// taking user id from the Express session (req.session.passport.user) 
// to get the user from the db and populate req.user
passport.deserializeUser(async (userId, done) => {
   try {
    const user = await User.findById(userId);
    done(null, user); 
   } catch (error) {
      done(error)
   } 
});