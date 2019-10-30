import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Create user', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicate email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register when required data is missing', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({
        ...user,
        name: '',
        email: '',
        password: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe('name is a required field');
    expect(response.body.messages[1].message).toBe('email is a required field');
    expect(response.body.messages[2].message).toBe(
      'password is a required field'
    );
  });
});
