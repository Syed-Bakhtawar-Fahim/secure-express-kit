import express from "express";
import { expressRateLimiter } from "./middleware/rateLimiter";
import { sanitizeMiddleware } from "./middleware/sanitizeMiddleware";

const app = express();
const PORT = 3000;

// Required middleware
app.use(express.json());

// 🔒 Attach your middleware
app.use(expressRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many requests from this IP. Try again later."
}));

// app.use(sqlSanitizer());
app.use(sanitizeMiddleware);

// 🧪 Test route
app.post("/test", (req, res) => {
  res.json({
    success: true,
    sanitizedBody: req.body,
    message: "Middleware applied successfully!"
  });
});

// Start the app
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
