import request from 'supertest';
import app from '../../../src/app';

import factory from '../../factories';
import truncate from '../../util/truncate';

describe('List one enrollment', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to show one enrollment when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .get(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to show one enrollment without jwt token', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app).get(
      `/enrollments/${enrollment.dataValues.id}`
    );

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to show one enrollment with invalid jwt token', async () => {
    const student = await factory.create('Student');
    const plan = await factory.create('Plan');
    const enrollment = await factory.create('Enrollment', {
      student_id: student.dataValues.id,
      plan_id: plan.dataValues.id,
    });

    const response = await request(app)
      .get(`/enrollments/${enrollment.dataValues.id}`)
      .set('Authorization', `Bearer 123456`);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });
});
