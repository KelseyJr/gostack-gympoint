import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('List help_orders without answer', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list all help orders without answer when authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/help-orders')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to list all help orders without answer without jwt token', async () => {
    const response = await request(app).get('/help-orders');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to list all help orders without answer with invalid jwt token', async () => {
    const response = await request(app)
      .get('/help-orders')
      .set('Authorization', `Bearer 123456`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });
});

describe('Create help order', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to create a help order with valid student', async () => {
    const student = await factory.create('Student');
    const helpOrder = await factory.attrs('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/students/${student.dataValues.id}/help-orders`)
      .send(helpOrder);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.question).not.toBe(null);
  });

  it('should not be able to create a help order without valid student', async () => {
    const student = await factory.create('Student');
    const helpOrder = await factory.attrs('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/students/56416845161/help-orders`)
      .send(helpOrder);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Student does not exists' });
  });

  it('should not be able to create a help order without question', async () => {
    const student = await factory.create('Student');
    const helpOrder = await factory.attrs('HelpOrder', {
      student_id: student.dataValues.id,
      question: undefined,
    });

    const response = await request(app)
      .post(`/students/${student.dataValues.id}/help-orders`)
      .send(helpOrder);

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe(
      'question is a required field'
    );
  });
});

describe('List help_orders from student', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list all help orders from student when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');

    const response = await request(app)
      .get(`/students/${student.dataValues.id}/help-orders`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to list all help orders without answer without jwt token', async () => {
    const student = await factory.create('Student');

    const response = await request(app).get(
      `/students/${student.dataValues.id}/help-orders`
    );

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to list all help orders without answer with invalid jwt token', async () => {
    const response = await request(app)
      .get(`/students/54651651651/help-orders`)
      .set('Authorization', `Bearer 123456`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });
});
