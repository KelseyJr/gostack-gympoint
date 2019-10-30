import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Student from '../src/app/models/Student';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: faker.random.number({ min: 0 }),
  weight: faker.random.number({ min: 0, max: 100, precision: 2 ** -1 }),
  height: faker.random.number({ min: 0, max: 100, precision: 2 ** -1 }),
});

export default factory;
