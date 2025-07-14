"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressRateLimiter = exports.sanitizeMiddleware = void 0;
exports.secureMiddleware = secureMiddleware;
const rateLimiter_1 = require("./middleware/rateLimiter");
const sanitizeMiddleware_1 = require("./middleware/sanitizeMiddleware");
function secureMiddleware(options = {}) {
    const middleware = [];
    if (options.rateLimit) {
        middleware.push((0, rateLimiter_1.expressRateLimiter)(options.rateLimit));
    }
    if (options.sanitizeMiddleware) {
        middleware.push(sanitizeMiddleware_1.sanitizeMiddleware);
    }
    return middleware;
}
var sanitizeMiddleware_2 = require("./middleware/sanitizeMiddleware");
Object.defineProperty(exports, "sanitizeMiddleware", { enumerable: true, get: function () { return sanitizeMiddleware_2.sanitizeMiddleware; } });
var rateLimiter_2 = require("./middleware/rateLimiter");
Object.defineProperty(exports, "expressRateLimiter", { enumerable: true, get: function () { return rateLimiter_2.expressRateLimiter; } });
