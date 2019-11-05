import request from 'supertest';
import { addMonths, parseISO } from 'date-fns';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('Create enrollment', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to create a enrollment when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a enrollment without jwt token', async () => {
    const enrollment = await factory.attrs('Enrollment');

    const response = await request(app)
      .post(`/enrollments/10`)
      .send(enrollment);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to create a enrollment with invalid jwt token', async () => {
    const enrollment = await factory.attrs('Enrollment');

    const response = await request(app)
      .post(`/enrollments/10`)
      .set('Authorization', `Bearer 123456`)
      .send(enrollment);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to create a enrollment when any required data is missing', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...enrollment,
        student_id: undefined,
        plan_id: undefined,
        start_date: undefined,
      });

    expect(response.status).toBe(400);
    expect(response.body.messages[0].message).toBe(
      'student_id is a required field'
    );
    expect(response.body.messages[1].message).toBe(
      'plan_id is a required field'
    );
    expect(response.body.messages[2].message).toBe(
      'start_date is a required field'
    );
  });

  it('should not be able to create a enrollment when student does not exists', async () => {
    const user = await factory.create('User');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: 10,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .post(`/enrollments/10`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Student does not exists' });
  });

  it('should not be able to create a enrollment when plan does not exists', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: 10,
    });

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Plan does not exists' });
  });

  it('should be create a end_date enrollment using enrollment.start_date plus plan.duration', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(200);
    expect(parseISO(response.body.end_date)).toEqual(
      addMonths(enrollment.start_date, plan.duration)
    );
  });

  it('should be create a price enrollment using plan.duration times plan.price', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(200);
    expect(response.body.price).toEqual(plan.duration * plan.price);
  });

  it('should not be create a enrollment to student when he is already enrolled', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.attrs('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    const response = await request(app)
      .post(`/enrollments/${student.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(enrollment);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Studen already enrolled into a plan',
    });
  });
});
