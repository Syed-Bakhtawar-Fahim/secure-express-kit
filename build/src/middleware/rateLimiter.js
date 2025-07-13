"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressRateLimiter = expressRateLimiter;
const responseHandler_1 = require("../utils/responseHandler");
const memoryStore = {};
function expressRateLimiter(options) {
    return (req, res, next) => {
        const key = req.ip;
        const now = Date.now();
        const windowStart = Math.floor(now / options.windowMs) * options.windowMs;
        if (!memoryStore[key] || memoryStore[key].resetTime <= now) {
            memoryStore[key] = { count: 1, resetTime: windowStart + options.windowMs };
        }
        else {
            memoryStore[key].count++;
        }
        const remaining = options.max - memoryStore[key].count;
        res.setHeader('X-RateLimit-Remaining', Math.max(remaining, 0));
        res.setHeader('X-RateLimit-Reset', memoryStore[key].resetTime);
        if (memoryStore[key].count > options.max) {
            return (0, responseHandler_1.sendResponse)(res, {
                success: false,
                message: options.message || "To many requests",
                statusCode: 429
            });
        }
        next();
    };
}
