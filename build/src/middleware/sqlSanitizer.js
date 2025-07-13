"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlSanitizer = sqlSanitizer;
const clean_1 = __importDefault(require("../helpers/clean"));
const sqlBlacklist = [
    "--",
    ";--",
    ";",
    "/*",
    "*/",
    "@@",
    "@",
    "char",
    "nchar",
    "varchar",
    "alter",
    "drop",
    "exec",
    "select",
    "union",
    "insert",
    "delete",
    "update",
    "shutdown",
];
function sqlSanitizer() {
    return (req, res, next) => {
        console.warn("Body", req.body);
        req.body = (0, clean_1.default)(req.body, sqlBlacklist);
        // Clean query safely without reassigning
        if (typeof req.query === "object" && req.query !== null) {
            for (const key in req.query) {
                req.query[key] = (0, clean_1.default)(req.query[key], sqlBlacklist);
            }
        }
        req.params = (0, clean_1.default)(req.params, sqlBlacklist);
        next();
    };
}
