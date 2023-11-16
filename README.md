<h1 align="center"><a href ="https://keech-writes-things.onrender.com">Keech Writes Things</a></h1>
<h3 align="center">
‼️📣ATTENTION: This app may take a couple of minutes to load due to <a href = "https://render.com/docs/free#spinning-down-on-idle">the limitations of Render's Free web service</a>. 
 Thank you for your patience❣️
</h3>
<br>
<div align="center"><img src="" alt="a nice preview of the app should be here" /></div> 
<br>

---

## Table of Contents

1. [App Features](#features)
2. [Local Usage](#localUsage)
3. [Tools and Dependencies](#tools)
4. [Environment variables](#environment-variables)
5. [Todos](#todos)
6. [Author](#author)


---
<br>

## App Features <a name = "features"></a>

Index page shows a list of blogs/links. Scrolling down the page will send requests to the server and load more blogs in chunks.
Guest users have read-only access to blog posts, and other content on the website. This restriciton is implemented by conditional rendering in the views that may show different content depending on the authenication status.

Immediately upon signing up, a user document is created in the database and the user can log in into their account and see authenticated-user-only content.

Authenticated users can (for the time limited by the validity of the session cookie) post and edit blogs (and will be able to edit about me content). The user can log out manually or they will be logged out automatically when the cookie expires. 
Any attempts to perform authenticated-user-only actions upon token expiration will be followed by redirection to the page with error message and automatic redirection to the index.

<br>

## Local Usage <a name = "localUsage"></a>

- Clone repository;
- Install dependencies - ```npm install``` ;
- Run the development server - ```npm run dev``` ;
- Run tests - ```npm run test``` .

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
- [Connect flash](https://github.com/jaredhanson/connect-flash) - storing and retrieving flash messages

#### Dev Dependencies

- [Mocha](https://jestjs.io/) - JavaScript testing framework
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

## Todos <a name = "todos"></a>

- Develop a solution to communicate free web service limits to users within the app; 
- Test client-side logic;
- Blog chunks should be showing in consistent style. As is, the first chunk to load on scroll appears not to be animated;
- Minify CSS;

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 
