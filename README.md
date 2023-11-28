<h1 align="center"><a href ="https://keech-writes-things.onrender.com">Keech Writes Things</a></h1>
<h3 align="center">
‼️📣ATTENTION: This app may take a couple of minutes to load due to <a href = "https://render.com/docs/free#spinning-down-on-idle">the limitations of Render's Free web service</a>. 
 Thank you for your patience❣️
</h3>
<br>
<div align="center"><img src="https://i.imgur.com/Tf9PNOm.gif" alt="Client 1 receives live updates as Client 2 performs them" /></div> 
<br>

---

## Table of Contents

1. [App Features and Limitations](#features)
2. [Local Usage](#localUsage)
3. [Tools and Dependencies](#tools)
4. [Environment variables](#environment-variables)
5. [Todos](#todos)
6. [Author](#author)


---
<br>

## App Features and Limitations <a name = "features"></a>

Index page shows a list of blogs/links. Scrolling down the page will send requests to the server and load more blogs in chunks.

Guest users have read-only access to blog posts, and other content on the website. This restriction is implemented by conditional rendering in the views that may show different content depending on the authenication status.

Immediately upon signing up, a user document is created in the database and the user can log in to their account and see authorized-user-only options.

Authorized users can (for the time limited by the validity of the session cookie) post and edit blogs. 
The user can log out manually or they will be logged out automatically when the cookie expires. 
Any attempts to perform authorized-user-only actions upon token expiration will be followed by redirection to the page with error message and automatic redirection to the index.

All users can enable live update feature and see all current blog and user activities.

### Limitations

- The number of users and blogs in the database is limited and each will be subjected to automatic deletion, oldest first, when the limit is reached;
- Request rate limit has been set up and the server will respond with error and block client requests whenever the limit is reached;
- Live update closes when navigating to a different page;

<br>

## Local Usage <a name = "localUsage"></a>

- Clone repository;
- Install dependencies - ```npm install``` ;
- In the root directory, run:
  ```openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout key.pem -out cert.pem -subj "/CN=localhost" -days 365```
  to create self-signed security certificate to bypass strict policies of some browsers (like Chrome);
- Run the development server - ```npm run dev``` ;
- Run tests - ```npm run test```;
- <b>IMPORTANT</b>: you have to explicitly type ```https``` to open the app in your browser in dev mode, example: https://localhost:3002. This is necessary because in dev environment, https Node module is used to create the server.


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
- [Node cache](https://github.com/node-cache/node-cache) - caching
- [WS](https://github.com/websockets/ws) - Node.js WebSocket library

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
HOST= #-- Should be https://localhost:{port_number} for live update to work under browser security restrictions <br>
WSS_HOST= #-- Should be wss://localhost:{port_number} <br>
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
- The enabled state of the live update feature should, ideally, persist in between rendering of different pages;
- Develop a solution to communicate free web service limits to users within the app;
- Test live update feature;
- Test client-side logic;
- Blog chunks should be showing in consistent style. As is, the first chunk to load on scroll appears not to be animated;
- Minify CSS;

<br>

## Author <a name = "author"></a>

[@marija-kov](https://github.com/Marija-Kov) 
