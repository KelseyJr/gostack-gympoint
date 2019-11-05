import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

import authMiddleware from './app/middlewares/auth';

import validateUserStore from './app/validators/User/UserStore';
import validateSessionStore from './app/validators/Session/SessionStore';
import validateStudentStore from './app/validators/Student/StudentStore';
import validateStudentUpdate from './app/validators/Student/StudentUpdate';
import validatePlanStore from './app/validators/Plan/PlanStore';
import validatePlanUpdate from './app/validators/Plan/PlanUpdate';
import validateEnrollmentStore from './app/validators/Enrollment/EnrollmentStore';
import validateEnrollmentUpdate from './app/validators/Enrollment/EnrollmentUpdate';

const routes = new Router();

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.use(authMiddleware);
routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', validateStudentUpdate, StudentController.update);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', validatePlanStore, PlanController.store);
routes.put('/plans', validatePlanUpdate, PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.get('/enrollments/:enrollment_id', EnrollmentController.show);
routes.post(
  '/enrollments/:student_id',
  validateEnrollmentStore,
  EnrollmentController.store
);
routes.put(
  '/enrollments/:enrollment_id',
  validateEnrollmentUpdate,
  EnrollmentController.update
);
routes.delete('/enrollments/:enrollment_id', EnrollmentController.delete);

export default routes;
