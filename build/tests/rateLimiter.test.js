"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const rateLimiter_1 = require("../middleware/rateLimiter");
const app = (0, express_1.default)();
app.use((0, rateLimiter_1.expressRateLimiter)({ windowMs: 20 * 60 * 1000, max: 2, message: "Too many requests" }));
app.get('/limited', (req, res) => {
    res.send('OK');
});
describe('Rate Limiter Middleware', () => {
    it('should allow up to 2 requests', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).get('/limited');
        const res = yield (0, supertest_1.default)(app).get('/limited');
        expect(res.status).toBe(200);
    }));
    it('should block on third request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).get('/limited');
        yield (0, supertest_1.default)(app).get('/limited');
        const res = yield (0, supertest_1.default)(app).get('/limited');
        expect(res.status).toBe(429);
        expect(res.text).toMatch(/Too many requests/);
    }));
});
