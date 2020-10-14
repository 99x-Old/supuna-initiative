import request from 'supertest';
import { test } from '@jest/globals';

const app = require('../app');

test('Health works', async () => {
  const response = await request(app.callback()).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toMatchSnapshot();
});
