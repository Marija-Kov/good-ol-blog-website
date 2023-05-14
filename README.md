<h1 align="center">Good Ol' Blog</h1>
<h3 align="center">A CRUD app built with NodeJS, EJS and MongoDB using MVC design pattern</h3>
<br>
<div align="center"><img src="" alt="a nice preview of the app should be here" /></div> 
<br>

---

## Table of Contents

1. [Why would you build a MVC blog from scratch?](#motivation)
2. [App Features](#features)
3. [Tools and Dependencies](#tools)
4. [Test coverage](#test)
5. [Todos](#todos)
6. [Resources](#resources)
7. [Author](#author)


---
<br>

## Whyyy? <a name = "motivation"></a>

Working on this project, one can learn how separation of concerns inside a system is achieved with the MVC pattern. 
It shows how a templating language is used to build user interfaces.
It demonstrates some mechanisms of sending data from the server to views and the convenience of local variables for displaying up-to-date content. 
It implements a widely-used authentication middleware.
It's a fun exercise for one's backend skills. 

<br>

## App Features <a name = "features"></a>

A guest user has a read-only access to blog posts, and other content on the website. This restriciton is implemented by conditional rendering in the views that may show different content depending on the authenication status.

Immediately upon signing up, a user document is created in the database and the user can log in into their account and see authenticated-user-only content.

An authenticated user can (for the time limited by the validity of the session cookie) post and edit blogs (and will be able to edit about me content). The user can log out manually or they will be logged out automatically when the cookie expires. 
Any attempts to perform authenticated-user-only actions upon token expiration will be followed by redirection to the page with error message and automatic redirection to the index.

<br>

## Tools and Dependencies <a name = "tools"></a>

- [NodeJS](https://nodejs.org/en/) - Server logic
- [Express](https://expressjs.com/) - Routing
- [EJS](https://ejs.co/) - Templating
- [MongoDB](https://account.mongodb.com/account/login) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB document modelling
- [Dotenv](https://www.npmjs.com/package/dotenv) - secret-keeping
- [Passport](https://www.passportjs.org/) - authentication middleware
- [Passport local](https://www.passportjs.org/packages/passport-local/) - passport local auth strategy (username & password)
- [Connect mongo](https://github.com/jdesboeufs/connect-mongo) - session store
- [Connect flash](https://github.com/jaredhanson/connect-flash) - storing messages to be shown in the UI

#### Dev Dependencies

- [Mocha](https://jestjs.io/) - Javascript testing framework
- [Chai](https://github.com/ladjs/supertest) - testing library
- [Chai-http](https://github.com/ladjs/supertest) - testing HTTP requests
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - testing/mocking MongoDB memory server in NodeJS
- [mongodb](https://www.npmjs.com/package/mongodb/v/3.7.3) - MongoDB driver for NodeJS
- [nyc](https://www.npmjs.com/package/nyc) - test coverage report

<br>

## Test coverage <a name = "test"></a>


File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s     
--------------------------|---------|----------|---------|---------|-----------------------
All files                 |   89.74 |    82.85 |   74.28 |   89.74 |                       
 blog-website             |   90.24 |      100 |   55.55 |   90.24 |                       
  app.js                  |   90.24 |      100 |   55.55 |   90.24 | 18,49,52,59           
 blog-website/config/test |     100 |      100 |     100 |     100 |                       
  database.config.js      |     100 |      100 |     100 |     100 |                       
 blog-website/controllers |   85.71 |    85.71 |   77.27 |   85.71 |                       
  authController.js       |   86.66 |      100 |   66.66 |   86.66 | 5,44                  
  blogController.js       |   85.41 |    85.71 |   78.94 |   85.41 | 12-13,34,55,71,87,102 
 blog-website/models      |   85.71 |       75 |     100 |   85.71 |                       
  blog.js                 |     100 |      100 |     100 |     100 |                       
  user.js                 |   81.25 |       70 |     100 |   81.25 | 25,32,36              
 blog-website/routes      |     100 |      100 |     100 |     100 |                       
  blogRoutes.js           |     100 |      100 |     100 |     100 |                       
  userRoutes.js           |     100 |      100 |     100 |     100 |                       


<br>

## Todos <a name = "todos"></a>

- Implement pagination, backend and frontend.
- Populate app features and resources in readme.
- Feature: Allow authenticated user to store blog post drafts.
- Remove unused packages.

<br>

## Resources <a name = "resources"></a>

Coming soon.

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 
