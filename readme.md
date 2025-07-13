# secure-express-kit

A modular security middleware toolkit for Express.js with built-in protection against common web attacks.

## ✨ Features

- ⚡ Rate Limiting (In-memory and Redis support)
- 🛡️ SQL Injection Detection & Blocking
- 🚫 XSS Protection using whitelist-based sanitization
- 🔧 Pluggable architecture for adding more middleware in the future

## 📦 Installation

```bash
npm install secure-express-kit
```

## Usage

```bash
import express from "express";
import { expressRateLimiter, sanitizeMiddleware } from "secure-express-kit";

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

### sanitizeMiddleware

1. Cleans all incoming:
    `req.body`
    `req.query`
    `req.params`

2. Detects:
    `XSS scripts using xss package`
    `SQL injection patterns (e.g. ' OR 1=1 --)`

Automatically blocks the request with 400 Bad Request if threats are found. If malicious input is detected:

```bash
{
  "success": false,
  "error": "Potential security risks detected",
  "details": [
    {
      "key": "username",
      "type": "SQL Injection",
      "originalValue": "' OR 1=1 --",
      "sanitizedValue": "' OR 1=1 --"
    }
  ]
}
```

## Future Plans (v2+)

1. Secure HTTP Headers - Add support similar to helmet
2. CSRF Token Middleware – Protection against cross-site request forgery
3. AI-based anomaly detection for malicious payloads - Block suspicious payloads with pattern learning
4. Rate Limiting for Micorservices - Redis/pub-sub friendly distributed throttling

## Author

```md
Made with ❤️ by Syed Bakhtawar(https://github.com/Syed-Bakhtawar-Fahim)