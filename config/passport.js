const passport = require("passport");
const { verifyPassword } = require("../utils/passwordUtils");
const LocalStrategy = require("passport-local").Strategy;
const connection = require('./database');
const User = connection.models.OtherUser;

// to verify credentials, passport will look for "username" and "password" literally, but this can be modified
// by setting up custom fields:
const customFields = {
    usernameField: "email",
    passwordField: "password"
}


// this is reminiscent of static methods:
const verifyCallback = async (email, password, done) => { // done is a function you eventually pass the result of your auth to
 try {
   const user = await User.findOne({ email: email });
   if(!user){
      return done(null, false) // error:null, res:false
   }
   const isValid = await verifyPassword(password, user.hash, user.salt);
   if(isValid){
      return done(null, user)
   } else {
      return done(null, false)
   }  
 } catch (error) {
    done(error);
 }
}

const strategy = new LocalStrategy(customFields, verifyCallback); // customFields are passed here as the 1st arg 

passport.use(strategy)

