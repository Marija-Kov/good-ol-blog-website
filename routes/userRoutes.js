const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const connection = require("../config/database");
const { genPassword } = require("../utils/passwordUtils");
const User = connection.models.OtherUser;

// router.post("/login", authController.user_login);
// router.get("/logout", authController.user_logout);

// passport middleware intercepts the request, verifies credentials and proceeds to the next middleware
router.post("/login", passport.authenticate("local"), (req, res, next) => {});

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
     console.log(newUser)
    } catch (error) {
       console.log(error) 
    }
    
});


module.exports = router;
