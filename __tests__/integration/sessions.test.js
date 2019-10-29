import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate with valid credentials', async () => {
    const user = await factory.create('User');
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid password', async () => {
    const user = await factory.create('User', {
      password: '123',
    });
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '1234',
      });

    expect(response.status).toBe(401);
  });

  it('should not authenticate with invalid email', async () => {
    const user = await factory.create('User', {
      email: 'teste@teste.com',
    });
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'teste2@teste.com',
        password: user.password,
      });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticate', async () => {
    const user = await factory.create('User');
    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
