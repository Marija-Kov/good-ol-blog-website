require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require("./routes/userRoutes");
const app = express();
const expressEjsLayouts = require('express-ejs-layouts');
 
const passport = require("passport");
const { session, sessionStore } = require("./config/sessionStore");
const flash = require("connect-flash");

const morgan = require('morgan');
app.use(express.json());  

app.set('view engine', 'ejs');                           
app.use(expressEjsLayouts);                         
app.use(express.static('public'));  
app.use(express.urlencoded({ extended: true }));
app.use(flash());

if(process.env.NODE_ENV === "development") {
  app.use(morgan('dev')); 
}

app.use(
      session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      unset: "destroy",
      cookie: {maxAge: 360000}
    })
   )

// REGISTER PASSPORT
require('./config/passport');
// keep reinitializing passport middleware as we hit different routes
app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
  if (req.session.flash && req.session.flash.error) {
    res.locals.error = req.session.flash.error;
  } else {
    res.locals.error = null;
  }
  if (req.session.flash && req.session.flash.success) {
    res.locals.success = req.session.flash.success;
  } else {
    res.locals.success = null;
  }
  if (req.user) {
    res.locals.draft = true;
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
    res.locals.draft = null;
  }
  req.flash(null);
  next();
});

app.get('/', (req, res) => {  
    res.redirect('/blogs'); 
})                         
app.get("/about", (req, res) => {
  res.render("about", { title: "About" }); 
});
app.get("/signup", (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
});
app.get("/login", (req, res) => {
  res.render("users/login", { title: "Log In" });
});

app.use('/blogs', blogRoutes);
app.use("/user", userRoutes);

app.use((req, res) => { 
    res.status(404).render("404", { title: "Page Not Found" });
})

function listen(){
  const port = process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT
  app.listen(port);
  console.log(`listening on port ${port}`)
}
listen()

module.exports = app;
