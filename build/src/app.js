"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const sanitizeMiddleware_1 = require("./middleware/sanitizeMiddleware");
const app = (0, express_1.default)();
const PORT = 3000;
// Required middleware
app.use(express_1.default.json());
// 🔒 Attach your middleware
app.use((0, rateLimiter_1.expressRateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: "Too many requests from this IP. Try again later."
}));
// app.use(sqlSanitizer());
app.use(sanitizeMiddleware_1.sanitizeMiddleware);
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
