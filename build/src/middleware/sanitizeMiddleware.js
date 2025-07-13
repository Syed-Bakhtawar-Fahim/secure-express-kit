"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMiddleware = void 0;
const xss_1 = __importDefault(require("xss"));
const sqlstring_1 = __importDefault(require("sqlstring"));
const responseHandler_1 = require("../utils/responseHandler");
const safeWhitelist = {
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
const xssOptions = {
    whiteList: safeWhitelist,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "iframe", "object", "embed"],
};
const sanitizeMiddleware = (req, res, next) => {
    const errors = [];
    const sanitizeAndDetect = (value, key) => {
        // 1. XSS Protection
        const xssSanitized = (0, xss_1.default)(value, xssOptions);
        if (xssSanitized !== value) {
            errors.push({ key, value, sanitizedValue: xssSanitized, type: "XSS" });
        }
        // 2. SQL Injection Detection (basic patterns)
        const sqlInjectionPattern = /('|--|\b(SELECT|UPDATE|DELETE|INSERT|DROP|UNION|OR)\b)/i;
        if (sqlInjectionPattern.test(value)) {
            const sqlEscaped = sqlstring_1.default.escape(value);
            errors.push({
                key,
                value,
                sanitizedValue: sqlEscaped,
                type: "SQL Injection",
            });
        }
        return xssSanitized;
    };
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = sanitizeAndDetect(obj[key], key);
            }
            else if (typeof obj[key] === "object" && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    if (req.body)
        sanitizeObject(req.body);
    if (req.query)
        sanitizeObject(req.query);
    if (req.params)
        sanitizeObject(req.params);
    if (errors.length > 0) {
        return (0, responseHandler_1.sendResponse)(res, {
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
exports.sanitizeMiddleware = sanitizeMiddleware;
