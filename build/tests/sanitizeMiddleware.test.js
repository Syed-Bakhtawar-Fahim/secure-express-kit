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
const sanitizeMiddleware_1 = require("../middleware/sanitizeMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(sanitizeMiddleware_1.sanitizeMiddleware);
app.post('/test', (req, res) => {
    res.status(200).json({ message: 'Passed' });
});
describe('Sanitize Middleware - Extended Tests', () => {
    const generateXssPayload = (i) => ({
        name: `<script>alert("xss${i}")</script>`
    });
    const generateSqlPayload = (i) => ({
        query: `' OR ${i}=${i} --`
    });
    const generateValidPayload = (i) => ({
        name: `User${i}`,
        email: `user${i}@example.com`
    });
    for (let i = 1; i <= 70; i++) {
        it(`XSS attack payload #${i} should be rejected`, () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post('/test').send(generateXssPayload(i));
            expect(res.status).toBe(400);
            expect(res.body.details[0].type).toBe('XSS');
        }));
    }
    for (let i = 1; i <= 70; i++) {
        it(`SQL injection payload #${i} should be rejected`, () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post('/test').send(generateSqlPayload(i));
            expect(res.status).toBe(400);
            expect(res.body.details[0].type).toBe('SQL Injection');
        }));
    }
    for (let i = 1; i <= 60; i++) {
        it(`Valid payload #${i} should pass`, () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post('/test').send(generateValidPayload(i));
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Passed');
        }));
    }
});
