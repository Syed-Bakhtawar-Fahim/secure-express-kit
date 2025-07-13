import { Request, Response, NextFunction } from 'express';
import { RateLimitOptions } from '../types/type';
import { sendResponse } from "../utils/responseHandler"

const memoryStore: Record<string, { count: number; resetTime: number }> = {};

export function expressRateLimiter(options: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = Math.floor(now / options.windowMs) * options.windowMs;

    if (!memoryStore[key] || memoryStore[key].resetTime <= now) {
      memoryStore[key] = { count: 1, resetTime: windowStart + options.windowMs };
    } else {
      memoryStore[key].count++;
    }

    const remaining = options.max - memoryStore[key].count;
    res.setHeader('X-RateLimit-Remaining', Math.max(remaining, 0));
    res.setHeader('X-RateLimit-Reset', memoryStore[key].resetTime);

    if (memoryStore[key].count > options.max) {
        return sendResponse(res, {
            success: false,
            message: options.message || "To many requests",
            statusCode: 429
        })
    }

    next();
  };
}