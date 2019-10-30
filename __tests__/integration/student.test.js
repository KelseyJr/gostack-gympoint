import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../util/truncate';

describe('Create student', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to store a student when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.attrs('Student');

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(student);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to store a student without jwt token', async () => {
    const student = await factory.attrs('Student');

    const response = await request(app)
      .post('/students')
      .send(student);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to store a student with invalid jwt token', async () => {
    const student = await factory.attrs('Student');

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer 123456`)
      .send(student);

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to store a student with duplicated email', async () => {
    const user = await factory.create('User');
    const student = await factory.attrs('Student');

    await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(student);

    const response = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send(student);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Duplicated email' });
  });
});

describe('Update student', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to update a student when authenticated', async () => {
    const user = await factory.create('User');
    const student = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${student.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...student.dataValues,
        name: 'Kelsey Junior',
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Kelsey Junior');
  });

  it('should not be able to update a student without jwt token', async () => {
    const student = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${student.dataValues.id}`)
      .send({
        ...student.dataValues,
        name: 'Kelsey Junior',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token not provided!' });
  });

  it('should not be able to update a student with invalid jwt token', async () => {
    const student = await factory.create('Student');

    const response = await request(app)
      .put(`/students/${student.dataValues.id}`)
      .set('Authorization', `Bearer 123456`)
      .send({
        ...student.dataValues,
        name: 'Kelsey Junior',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'Token invalid!' });
  });

  it('should not be able to update a student with duplicated email', async () => {
    const user = await factory.create('User');
    const student1 = await factory.create('Student', {
      email: 'teste@teste.com',
    });
    const student2 = await factory.create('Student', {
      email: 'teste2@teste.com',
    });

    const response = await request(app)
      .put(`/students/${student1.dataValues.id}`)
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        ...student1.dataValues,
        email: student2.dataValues.email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: 'Duplicated email' });
  });
});
