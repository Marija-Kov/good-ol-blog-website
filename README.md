<h1 align="center"><a href ="https://keech-writes-things.onrender.com">Good Ol' Blog</a></h1>
<h3>
 ATTENTION: This app may take a couple of minutes to load due to <a href = "https://render.com/docs/free#spinning-down-on-idle">the limitations of Render's Free web service</a>. 
 Thank you for your patience!
</h3>
<br>
<div align="center"><img src="" alt="a nice preview of the app should be here" /></div> 
<br>

---

## Table of Contents

1. [Technical overview](#overview)
2. [App Features](#features)
3. [Tools and Dependencies](#tools)
4. [Environment variables](#environment-variables)
5. [Test coverage](#test)
6. [Todos](#todos)
7. [Resources](#resources)
8. [Author](#author)


---
<br>

## Technical overview <a name = "overview"></a>

A CRUD app using MVC architecture pattern to achieve separation of concerns.
It shows how a templating language is used to build user interfaces.
It demonstrates some mechanisms of sending data from the server to views and the convenience of local variables for displaying up-to-date content. 
It implements a widely-used authentication middleware and rate-limiter.

<br>

## App Features <a name = "features"></a>

Index page shows a list of blogs/links. Scrolling down the page will send requests to the server and load more blogs in chunks.
Guest users have read-only access to blog posts, and other content on the website. This restriciton is implemented by conditional rendering in the views that may show different content depending on the authenication status.

Immediately upon signing up, a user document is created in the database and the user can log in into their account and see authenticated-user-only content.

Authenticated users can (for the time limited by the validity of the session cookie) post and edit blogs (and will be able to edit about me content). The user can log out manually or they will be logged out automatically when the cookie expires. 
Any attempts to perform authenticated-user-only actions upon token expiration will be followed by redirection to the page with error message and automatic redirection to the index.

<br>

## Tools and Dependencies <a name = "tools"></a>

- [NodeJS](https://nodejs.org/en/) - Server logic
- [Express](https://expressjs.com/) - Routing
- [Express rate limit](https://github.com/express-rate-limit/express-rate-limit) - Request rate limiting
- [EJS](https://ejs.co/) - Templating
- [Express EJS layouts](https://www.npmjs.com/package/express-ejs-layouts) - Building reusable layouts
- [MongoDB](https://account.mongodb.com/account/login) - Database
- [Mongoose](https://mongoosejs.com/) - MongoDB document modelling
- [Dotenv](https://www.npmjs.com/package/dotenv) - secret-keeping
- [Passport](https://www.passportjs.org/) - authentication middleware
- [Passport local](https://www.passportjs.org/packages/passport-local/) - passport local auth strategy (username & password)
- [Connect mongo](https://github.com/jdesboeufs/connect-mongo) - session store
- [Connect flash](https://github.com/jaredhanson/connect-flash) - storing messages to be shown in the UI

#### Dev Dependencies

- [Mocha](https://jestjs.io/) - Javascript testing framework
- [Chai](https://www.chaijs.com/) - testing library
- [Chai-http](https://www.chaijs.com/plugins/chai-http/) - testing HTTP requests
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server) - testing/mocking MongoDB memory server in NodeJS
- [mongodb](https://www.npmjs.com/package/mongodb/v/3.7.3) - MongoDB driver for NodeJS
- [nyc](https://www.npmjs.com/package/nyc) - test coverage report

<br>

## Environment variables <a name = "environment-variables"></a>
If you want to run the app in your local environment, you'll need to create a .env file in the root directory and provide values for the variables below.<br><br>
MONGO_URI= <br>
TEST_MONGO_URI= <br>
SECRET=<br>
HOST=<br>
TEST_PORT=<br>
PORT=<br>
DOMAIN=<br>
PER_PAGE_LIMIT=<br>
TEST_MAX_USERS_LIMIT=<br>
TEST_MAX_BLOGS_LIMIT=<br>
MAX_USERS_LIMIT=<br>
MAX_BLOGS_LIMIT=<br>

#Keep in mind the number of user and blog route tests when you're setting test rate limit.<br>
MAX_API_USER_REQS=<br>
TEST_MAX_API_USER_REQS=<br>

API_USER_WINDOW_MS=<br>
TEST_API_USER_WINDOW_MS=<br>

MAX_API_BLOGS_REQS=<br>
TEST_MAX_API_BLOGS_REQS=<br>

API_BLOGS_WINDOW_MS=<br>
TEST_API_BLOGS_WINDOW_MS=<br>
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

- Test client-side logic;
- Blog chunks should be showing in consistent style. As is, the first chunk to load on scroll is not animated;
- Minify CSS;

<br>

## Resources <a name = "resources"></a>

Coming soon.

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 
