const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require("./routes/userRoutes");
const app = express();
require('dotenv').config(); 

mongoose.set("strictQuery", false);

app.use(express.json());  

const dbURI = process.env.MONGO_URI;  
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })  
     .then(result => app.listen(3002))
     .then(()=>console.log('connected'))
     .catch(error=> console.log(`Error: ${error}`));


app.set('view engine', 'ejs');  
                          
app.use(express.static('public'));  
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
    res.redirect('/blogs'); 
})                         

app.get("/about", (req, res) => {
  res.render("about", { title: "About" }); 
});
app.get("/login", (req, res) => {
  res.render("users/login", { title: "Log In" });
});

app.use('/blogs', blogRoutes);
app.use("/user", userRoutes);

app.use((req, res) => { 
    res.status(404).render("404", { title: "Page Not Found" });
})

module.exports = app
