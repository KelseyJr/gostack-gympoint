import request from 'supertest';
import { parseISO } from 'date-fns';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Answer help_orders', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to answer a help order when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const helpOrder = await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        answer: 'Teste',
      });

    expect(response.status).toBe(200);
    expect(response.body.answer).toBe('Teste');
    expect(parseISO(response.body.answer_at)).not.toBe(null);
  });

  it('should not be able to answer a help order without answer without jwt token', async () => {
    const student = await factory.create('Student');
    const helpOrder = await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .send({
        answer: 'Teste',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to answer a help order without answer with invalid jwt token', async () => {
    const student = await factory.create('Student');
    const helpOrder = await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .set('Authorization', `Bearer 56651654`)
      .send({
        answer: 'Teste',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to answer a help order when any required data is missing', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const helpOrder = await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        answer: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe(
      'answer is a required field'
    );
  });

  it('should not be able to answer a help order when its does not exists', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    const response = await request(app)
      .post(`/help-orders/5456464645/answer`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        answer: 'Teste',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Help Order does not exists!',
    });
  });

  it('should not be able to answer a help order when its already answered', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const helpOrder = await factory.create('HelpOrder', {
      student_id: student.dataValues.id,
    });

    await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        answer: 'Teste',
      });

    const response = await request(app)
      .post(`/help-orders/${helpOrder.dataValues.id}/answer`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        answer: 'Teste',
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Help Order already answered!',
    });
  });
});
