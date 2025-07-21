# Express Shield SecureKit

A modular security middleware toolkit for Express.js with built-in protection against common web attacks including SQL Injection, XSS, and request flooding.

## ✨ Features

- ⚡ **Rate Limiting** (in-memory & Redis)
- 🛡️ **SQL Injection Detection & Blocking**
- 🚫 **XSS Protection** using sanitization
- 🔌 **Modular Middleware Architecture**

---

## 📦 Installation

```bash
npm install express-shield-securekit
```

---

## Usage

### Method 1: Manual Middleware Setup (Flexible but Verbose)

```bash
import { expressRateLimiter, sanitizeMiddleware } from "express-shield-securekit";

const app = express();
app.use(express.json());

// Rate Limiter Middleware
app.use(expressRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 5,
  message: "Too many requests. Please try again later."
}));

// Global Sanitizer Middleware (XSS + SQL Injection)
app.use(sanitizeMiddleware);

app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Request passed all security checks!",
    sanitizedBody: req.body,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Method 2: Easy Integration (Recommended)

```bash
const { secureMiddleware } = require("express-shield-securekit");

const app = express();
app.use(express.json());

rateLimitOptions = {
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests. Please try again later."
}

app.use(secureMiddleware({
    rateLimit: rateLimitOptions,
    sanitizeMiddleware: true
}))

app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Request passed all security checks!",
    sanitizedBody: req.body,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

---

## 🧱 Middleware Provided

### expressRateLimiter(options)

Simple rate limiter middleware for Express.

**Options:**

- `windowMs` — Duration of time window in milliseconds
- `max` — Maximum requests allowed per IP in the time window
- `message` — Custom error message on rate limit exceeded

**Example:**

```bash
app.use(expressRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many requests. Try again in a minute."
}));
```

---

### sanitizeMiddleware

1. Clean all incoming `req.body`, `req.query` and `req.params`.
2. Detect `XSS scripts using xss package` and `SQL injection patterns`.
3. Automatically blocks the request with 400 Bad Request if threats are found. If malicious input is detected.

## Future Plans (v2+)

1. Secure HTTP Headers - Add support similar to Helmet
2. CSRF Token Middleware – Protection against cross-site request forgery
3. AI-based anomaly detection for malicious payloads - Block suspicious payloads with pattern learning
4. Rate Limiting for Microservices - Redis/pub-sub friendly distributed throttling

## Test

```bash
npm test
```

## Author

Made with ❤️ by [Syed Bakhtawar Fahim](https://github.com/Syed-Bakhtawar-Fahim)
