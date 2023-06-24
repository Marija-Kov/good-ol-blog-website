import rateLimit from "express-rate-limit";

export const api_user_limiter = rateLimit({
  windowMs:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.API_USER_WINDOW_MS)
      : Number(process.env.TEST_API_USER_WINDOW_MS),
  max:
    process.env.NODE_ENV !== "test"
      ? Number(process.env.MAX_API_USER_REQS)
      : Number(process.env.TEST_MAX_API_USER_REQS),
  message: async (req, res) => {
    req.flash("error", "⚠Too many requests. Please try later.")
    res.status(429).render("tooManyRequests", { title: "Error 429" });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const api_blogs_limiter = rateLimit({
    windowMs:
      process.env.NODE_ENV !== "test"
        ? Number(process.env.API_BLOGS_WINDOW_MS)
        : Number(process.env.TEST_API_BLOGS_WINDOW_MS),
    max:
      process.env.NODE_ENV !== "test"
        ? Number(process.env.MAX_API_BLOGS_REQS)
        : Number(process.env.TEST_MAX_API_BLOGS_REQS),
    message: async (req, res) => {
      req.flash("error", "⚠Too many requests. Please try later.")
      res.status(429).render("tooManyRequests", { title: "Error 429" });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  