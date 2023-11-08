import rateLimit from "express-rate-limit";
const userWindow =
  process.env.NODE_ENV !== "test"
    ? Number(process.env.API_USER_WINDOW_MS)
    : Number(process.env.TEST_API_USER_WINDOW_MS);
const userMax =
  process.env.NODE_ENV !== "test"
    ? Number(process.env.MAX_API_USER_REQS)
    : Number(process.env.TEST_MAX_API_USER_REQS);
const blogWindow =
  process.env.NODE_ENV !== "test"
    ? Number(process.env.API_BLOGS_WINDOW_MS)
    : Number(process.env.TEST_API_BLOGS_WINDOW_MS);
const blogMax =
  process.env.NODE_ENV !== "test"
    ? Number(process.env.MAX_API_BLOGS_REQS)
    : Number(process.env.TEST_MAX_API_BLOGS_REQS);

const formatTime = (window) => {
  const minutes = Math.floor(window / 60000);
  const seconds = (window - minutes * 60000) / 1000;
  return `${minutes} min ${seconds} sec`;
};

export const api_user_limiter = rateLimit({
  windowMs: userWindow,
  max: userMax,
  message: `<div><h1>⚠Too many login/signup requests. Please try in ${formatTime(
    userWindow
  )}.</h1><a href='/blogs'>Leave this page</a></div>`,
  standardHeaders: true,
  legacyHeaders: false,
});

export const api_blogs_limiter = rateLimit({
  windowMs: blogWindow,
  max: blogMax,
  message: `<div><h1>⚠Too many blog requests. Please try in ${formatTime(
    blogWindow
  )}.</h1><h2><a href='/about'>Leave this page</a></h2></div>`,
  standardHeaders: true,
  legacyHeaders: false,
});
