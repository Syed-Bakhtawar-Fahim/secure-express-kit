import express from 'express';
import request from 'supertest';
import { expressRateLimiter } from '../middleware/rateLimiter';

const app = express();
app.use(expressRateLimiter({ windowMs: 20 * 60 * 1000, max: 2, message: "Too many requests" }));

app.get('/limited', (req, res) => {
  res.send('OK');
});

describe('Rate Limiter Middleware', () => {
  it('should allow up to 2 requests', async () => {
    await request(app).get('/limited');
    const res = await request(app).get('/limited');
    expect(res.status).toBe(200);
  });

  it('should block on third request', async () => {
    await request(app).get('/limited');
    await request(app).get('/limited');
    const res = await request(app).get('/limited');
    expect(res.status).toBe(429);
    expect(res.text).toMatch(/Too many requests/);
  });
});
