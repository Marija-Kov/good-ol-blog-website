const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { connection } = require("./database");

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
  });

  module.exports = { session, sessionStore }