import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import DB from "./config/database.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressEjsLayouts from "express-ejs-layouts";
import { api_user_limiter, api_blogs_limiter } from "./config/rateLimiters.js";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo";
import flash from "connect-flash";
import morgan from "morgan";
import fs from "fs";
import https from "https";
import { WebSocketServer } from "ws";

mongoose.set("strictQuery", false);
const app = express();
const MongoStore = connectMongo(session);

app.use(express.json());
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const sessionStore = new MongoStore({
  mongooseConnection: DB.connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    unset: "destroy",
    cookie: { maxAge: 360000 },
  })
);

import("./config/passport.js");

app.use(passport.initialize());
app.use(passport.session());

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

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/signup", (req, res) => {
  res.render("users/signup", { title: "Sign Up" });
});
app.get("/login", (req, res) => {
  res.render("users/login", { title: "Log In" });
});

app.use("/blogs", api_blogs_limiter);
app.use("/user", api_user_limiter);
app.use("/blogs", blogRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

const server =
  process.env.NODE_ENV === "production"
    ? https.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync("key.pem"),
          cert: fs.readFileSync("cert.pem"),
        },
        app
      );

const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  console.log("WSS connection established");
  ws.on("close", () => {
    console.log("WS connection closed");
  });
});

function listen() {
  const port =
    process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT;
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

listen();

export default app;
