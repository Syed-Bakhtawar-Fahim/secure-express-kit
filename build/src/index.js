"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureMiddleware = secureMiddleware;
const rateLimiter_1 = require("./middleware/rateLimiter");
const sanitizeMiddleware_1 = require("./middleware/sanitizeMiddleware");
const express_1 = require("express");
function secureMiddleware(options = {}) {
    const middleware = [];
    if (options.rateLimit) {
        middleware.push((0, rateLimiter_1.expressRateLimiter)(options.rateLimit));
    }
    if (options.sanitizeMiddleware) {
        middleware.push((0, sanitizeMiddleware_1.sanitizeMiddleware)(express_1.Request, express_1.Response, express_1.NextFunction));
    }
    return middleware;
}
