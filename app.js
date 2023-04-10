const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require("./routes/userRoutes");
const app = express();
const expressEjsLayouts = require('express-ejs-layouts');
require('dotenv').config(); 
const passport = require("passport");

// SESSION STORAGE
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.set("strictQuery", false);

app.use(express.json());  

const dbURI = process.env.MONGO_URI;  
const mongooseConnection = mongoose.createConnection(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

  //  mongoose.connect(dbURI, {
  //    useNewUrlParser: true,
  //    useUnifiedTopology: true,
  //  })
  // .then((result) => app.listen(process.env.PORT))
  // .then(() => console.log("connected"))
  // .catch((error) => console.log(`Error: ${error}`));

app.set('view engine', 'ejs');  
                          
app.use(expressEjsLayouts);                         
app.use(express.static('public'));  
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongooseConnection: mongooseConnection,
  collection: 'sessions'
});

app.use(
      session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {maxAge: 360000}
    })
   )

app.use((req, res, next) => {
  if (req.headers.cookie && req.headers.cookie.match(/userId/i)) {
    const cookies = {};
    const cookiesArray = req.headers.cookie.split(";");
    cookiesArray.forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = value;
  });
  res.locals.user = cookies;
  } else {
  res.locals.user = null;
  }
  next();
});

// REGISTER PASSPORT
require('./config/passport');
// keep reinitializing passport middleware as we hit different routes
app.use(passport.initialize());
app.use(passport.session())

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
  app.listen(process.env.PORT)
  console.log('listening')
}
listen()

module.exports = app
