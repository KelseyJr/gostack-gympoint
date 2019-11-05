import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Make checkin', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to student make a checkin', async () => {
    const student = await factory.create('Student');

    const response = await request(app).post(
      `/students/${student.dataValues.id}/checkins`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to student make a checkin when student not exists', async () => {
    const response = await request(app).post(`/students/7845/checkins`);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Student does not exists' });
  });

  it('should not be able to sudent make a checkin mora than 5 times during 7 days in row', async () => {
    const student = await factory.create('Student');

    await request(app).post(`/students/${student.dataValues.id}/checkins`);
    await request(app).post(`/students/${student.dataValues.id}/checkins`);
    await request(app).post(`/students/${student.dataValues.id}/checkins`);
    await request(app).post(`/students/${student.dataValues.id}/checkins`);
    await request(app).post(`/students/${student.dataValues.id}/checkins`);
    const response = await request(app).post(
      `/students/${student.dataValues.id}/checkins`
    );

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'You can only check-in 5 times every 7 days!',
    });
  });
});

describe('List checkins from user', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to list checkins from student', async () => {
    const student = await factory.create('Student');
    await factory.create('Checkin', {
      student_id: student.dataValues.id,
    });

    const response = await request(app).get(
      `/students/${student.dataValues.id}/checkins`
    );

    expect(response.status).toBe(200);
  });
});
