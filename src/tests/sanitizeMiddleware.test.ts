import express from 'express';
import request from 'supertest';
import { sanitizeMiddleware } from '../middleware/sanitizeMiddleware';

const app = express();
app.use(express.json());
app.use(sanitizeMiddleware);

app.post('/test', (req, res) => {
  res.status(200).json({ message: 'Passed' });
});

describe('Sanitize Middleware - Extended Tests', () => {
  const generateXssPayload = (i: number) => ({
    name: `<script>alert("xss${i}")</script>`
  });

  const generateSqlPayload = (i: number) => ({
    query: `' OR ${i}=${i} --`
  });

  const generateValidPayload = (i: number) => ({
    name: `User${i}`,
    email: `user${i}@example.com`
  });

  for (let i = 1; i <= 70; i++) {
    it(`XSS attack payload #${i} should be rejected`, async () => {
      const res = await request(app).post('/test').send(generateXssPayload(i));
      expect(res.status).toBe(400);
      expect(res.body.details[0].type).toBe('XSS');
    });
  }

  for (let i = 1; i <= 70; i++) {
    it(`SQL injection payload #${i} should be rejected`, async () => {
      const res = await request(app).post('/test').send(generateSqlPayload(i));
      expect(res.status).toBe(400);
      expect(res.body.details[0].type).toBe('SQL Injection');
    });
  }

  for (let i = 1; i <= 60; i++) {
    it(`Valid payload #${i} should pass`, async () => {
      const res = await request(app).post('/test').send(generateValidPayload(i));
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Passed');
    });
  }
});
