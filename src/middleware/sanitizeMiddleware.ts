import { Request, Response, NextFunction } from "express";
import xss, { IWhiteList, IFilterXSSOptions } from "xss";
import sqlString from "sqlstring";
import { sendResponse } from "../utils/responseHandler"

const safeWhitelist: IWhiteList = {
  a: ["href", "title", "target"],
  b: [],
  i: [],
  strong: [],
  em: [],
  p: [],
  ul: [],
  li: [],
  ol: [],
  br: [],
  span: ["style"],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
};

const xssOptions: IFilterXSSOptions = {
  whiteList: safeWhitelist,
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "iframe", "object", "embed"],
};

interface SanitizationError {
  key: string;
  value: any;
  sanitizedValue: any;
  type: "XSS" | "SQL Injection";
}

export const sanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: SanitizationError[] = [];

  const sanitizeAndDetect = (value: string, key: string): string => {
    // 1. XSS Protection
    const xssSanitized = xss(value, xssOptions);
    if (xssSanitized !== value) {
      errors.push({ key, value, sanitizedValue: xssSanitized, type: "XSS" });
    }

    // 2. SQL Injection Detection (basic patterns)
    const sqlInjectionPattern =
      /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR)\b)/i;
    if (sqlInjectionPattern.test(value)) {
      const sqlEscaped = sqlString.escape(value);
      errors.push({
        key,
        value,
        sanitizedValue: sqlEscaped,
        type: "SQL Injection",
      });
    }

    return xssSanitized;
  };

  const sanitizeObject = (obj: Record<string, any>): void => {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = sanitizeAndDetect(obj[key], key);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query as Record<string, any>);
  if (req.params) sanitizeObject(req.params as Record<string, any>);

  if (errors.length > 0) {
    return sendResponse(res, {
      success: false,
      message: "Potential security risks detected",
      statusCode: 400,
      details: errors.map((err) => ({
        key: err.key,
        type: err.type,
        originalValue: err.value,
        sanitizedValue: err.sanitizedValue,
      })),
    });
  }

  next();
};
