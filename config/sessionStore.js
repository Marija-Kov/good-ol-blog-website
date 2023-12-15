import connectMongo from "connect-mongo";
import session from "express-session";

const createSessionStore = async () => {
  let DB;
  if (process.env.NODE_ENV !== "test") {
    try {
      const db = await import("../config/database.js");
      DB = db.default;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const db = await import("../config/test/database.js");
      DB = db.default;
    } catch (error) {
      console.log(error);
    }
  }
  const MongoStore = connectMongo(session);
  return new MongoStore({
    mongooseConnection: DB.connection,
    collection: "sessions",
  });
};

export default async function createSession() {
  const sessionStore = await createSessionStore();
  return session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    unset: "destroy",
    cookie: { maxAge: 360000 },
  });
}
