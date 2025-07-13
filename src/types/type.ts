export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export interface SecureMiddlewareOptions {
  rateLimit?: RateLimitOptions;
  sqlInjection?: boolean;
  xss?: boolean;
  sanitizeMiddleware?: boolean;
}