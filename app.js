import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressEjsLayouts from "express-ejs-layouts";
import { api_user_limiter, api_blogs_limiter } from "./config/rateLimiters.js";
import passport from "passport";
import flash from "connect-flash";
import morgan from "morgan";
import fs from "fs";
import http from "http";
import https from "https";
import createSession from "./config/sessionStore.js"
import { WebSocketServer } from "ws";
import routeCache from "./routeCache.js";
const cache = routeCache.middleware;

mongoose.set("strictQuery", false);
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const session = await createSession();
app.use(session);

import("./config/passport.js");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.wssHost = process.env.WSS_HOST;
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
app.get("/about", cache(3600), (req, res) => {
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
    ? http.createServer(app)
    : https.createServer(
        {
          key: fs.readFileSync("key.pem"),
          cert: fs.readFileSync("cert.pem"),
        },
        app
      );

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WSS connection established");

  ws.send("Listening...");

  ws.on("message", (data) => {
    console.log("received: %s", data);
  });

  ws.on("error", () => {
    ws.send("❌ Something went wrong");
  });

  ws.on("close", () => {
    console.log("WS connection closed");
  });
});

function listen() {
  const port =
    process.env.NODE_ENV === "test" ? process.env.TEST_PORT : process.env.PORT;

  server.listen(port, () => {
    console.log(`HTTP server is listening on port ${port}`);
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
}

listen();

export { app, wss };
