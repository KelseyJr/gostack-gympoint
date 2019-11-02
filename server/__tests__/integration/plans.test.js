import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Create plan', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to create a new plan when user is authenticated', async () => {
    const user = await factory.create('User');
    const plan = await factory.attrs('Plan');

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(plan);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a plan without jwt token', async () => {
    const plan = await factory.attrs('Plan');

    const response = await request(app)
      .post('/plans')
      .send(plan);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to store a plan with invalid jwt token', async () => {
    const plan = await factory.attrs('Plan');

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer 123456`)
      .send(plan);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to create a plan when any required fields is missing', async () => {
    const user = await factory.create('User');
    const plan = await factory.attrs('Plan');

    const response = await request(app)
      .post('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...plan,
        title: '',
        duration: undefined,
        price: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe('title is a required field');
    expect(response.body.messages[1].message).toBe(
      'duration is a required field'
    );
    expect(response.body.messages[2].message).toBe('price is a required field');
  });
});

describe('Update plan', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to update a new plan when user is authenticated', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');

    const response = await request(app)
      .put('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...plan.dataValues,
        title: 'Title successed modified',
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Title successed modified');
  });

  it('should not be able to update a plan without jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app)
      .put('/plans')
      .send({
        ...plan.dataValues,
        title: 'Title successed modified',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to update a plan with invalid jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app)
      .put('/plans')
      .set('Authorization', `Bearer 123456`)
      .send({
        ...plan.dataValues,
        title: 'Title successed modified',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be be able to update a plan when any required fields is missing', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');

    const response = await request(app)
      .put('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...plan.dataValues,
        title: '',
        duration: undefined,
        price: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe('title is a required field');
    expect(response.body.messages[1].message).toBe(
      'duration is a required field'
    );
    expect(response.body.messages[2].message).toBe('price is a required field');
  });

  it('should not be be able to update a plan when plan does not exist', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');

    const response = await request(app)
      .put('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...plan.dataValues,
        id: 10,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exist' });
  });
});

describe('Delete plan', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to delete a new plan when user is authenticated', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');

    const response = await request(app)
      .delete(`/plans/${plan.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to delete a plan without jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app).delete(`/plans/${plan.dataValues.id}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to delete a plan with invalid jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app)
      .delete(`/plans/${plan.dataValues.id}`)
      .set('Authorization', 'Bearer 123456');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be be able to delete a plan when plan does not exist', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .delete(`/plans/20`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exist' });
  });
});

describe('List all plans', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list all plans when user is authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to list all plans without jwt token', async () => {
    const response = await request(app).get('/plans');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to list all plans with invalid jwt token', async () => {
    const response = await request(app)
      .get('/plans')
      .set('Authorization', 'Bearer 123456');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });
  /*
  it('should not be be able to delete a plan when plan does not exist', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .delete(`/plans/20`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exist' });
  });
  */
});

describe('List single plan', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list a single plan when user is authenticated', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');

    const response = await request(app)
      .get(`/plans/${plan.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to list all plans without jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app).get(`/plans/${plan.dataValues.id}`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to list all plans with invalid jwt token', async () => {
    const plan = await factory.create('Plan');

    const response = await request(app)
      .get(`/plans/${plan.dataValues.id}`)
      .set('Authorization', 'Bearer 123456');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be be able to list a single plan when plan does not exist', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get(`/plans/20`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exist' });
  });
});
