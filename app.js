const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require("./routes/userRoutes");
const app = express();
const expressEjsLayouts = require('express-ejs-layouts');
require('dotenv').config(); 
const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");
mongoose.set("strictQuery", false);

app.use(express.json());  

const { connection } = require("./config/database")

app.set('view engine', 'ejs');  
                          
app.use(expressEjsLayouts);                         
app.use(express.static('public'));  
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));
app.use(flash());

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions'
});

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
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
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
