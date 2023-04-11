const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const connection = require("../config/database");
const { genPassword } = require("../utils/passwordUtils");
const User = connection.models.User;

// router.post("/login", authController.user_login);
// router.get("/logout", authController.user_logout);

// passport middleware intercepts the request, verifies credentials and proceeds to the next middleware
router.post("/login", passport.authenticate("local", {failureRedirect: '/404', successRedirect:'/blogs/create'}));

router.post("/signup", async (req, res, next) => {
    try {
     const {salt, hash} = await genPassword(req.body.password);
     const newUser = new User({
         email: req.body.email,
         hash: hash,
         salt: salt
    })
     newUser.save();
     res.redirect('/login')  
    } catch (error) {
       console.log(error) 
    }
    
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.redirect("/login");
    }); 
})


module.exports = router;
