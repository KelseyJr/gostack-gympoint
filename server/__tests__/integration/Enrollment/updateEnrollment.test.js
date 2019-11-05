import request from 'supertest';
import { parseISO, addMonths } from 'date-fns';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('Update enrollment', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to update a enrollment when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const newStartDate = addMonths(enrollment.dataValues.start_date, 2);
    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...enrollment.dataValues,
        start_date: newStartDate,
      });

    expect(response.status).toBe(200);
    expect(parseISO(response.body.start_date)).toEqual(newStartDate);
  });

  it('should not be able to update a enrollment without jwt token', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .send({
        ...enrollment.dataValues,
        price: 250,
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to update a enrollment with invalid jwt token', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer 123456`)
      .send({
        ...enrollment.dataValues,
        price: 250,
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to update a enrollment when any required data is missing', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...enrollment.dataValues,
        student_id: undefined,
        plan_id: undefined,
        start_date: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe(
      'plan_id is a required field'
    );
    expect(response.body.messages[1].message).toBe(
      'start_date is a required field'
    );
  });

  it('should not be able to update a enrollent when its not found', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/5616465164651`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment.dataValues);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Enrollment does not exists',
    });
  });

  it('should not be able to update a enrollment when a plan is not found', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...enrollment.dataValues,
        plan_id: plan.dataValues.id + 1,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exists' });
  });

  it('should not be able to update a enrollent when a student is not found', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...enrollment.dataValues,
        student_id: 1561561,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Student does not exists' });
  });

  it('should be updated a end_date enrollment using enrollment.start_date plus plan.duration', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment.dataValues);

    expect(response.status).toBe(200);
    expect(parseISO(response.body.end_date)).toEqual(
      addMonths(enrollment.dataValues.start_date, plan.dataValues.duration)
    );
  });

  it('should be updated a price enrollment using plan.duration times plan.price', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .put(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment.dataValues);

    expect(response.status).toBe(200);
    expect(response.body.price).toEqual(
      plan.dataValues.duration * plan.dataValues.price
    );
  });
});
