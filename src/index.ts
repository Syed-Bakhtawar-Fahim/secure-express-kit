import { SecureMiddlewareOptions } from "./types/type";
import { expressRateLimiter } from "./middleware/rateLimiter";
import { sanitizeMiddleware } from "./middleware/sanitizeMiddleware";
import { Request, Response, NextFunction } from "express";

export function secureMiddleware(options: SecureMiddlewareOptions = {}) {
  const middleware = [];

  if (options.rateLimit) {
    middleware.push(expressRateLimiter(options.rateLimit));
  }
  if (options.sanitizeMiddleware) {
    middleware.push(sanitizeMiddleware);
  }
  return middleware;
}

export { sanitizeMiddleware } from './middleware/sanitizeMiddleware';
export { expressRateLimiter } from './middleware/rateLimiter';
