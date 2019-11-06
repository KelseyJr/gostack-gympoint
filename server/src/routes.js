import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import authMiddleware from './app/middlewares/auth';

import validateUserStore from './app/validators/User/UserStore';
import validateSessionStore from './app/validators/Session/SessionStore';
import validateStudentStore from './app/validators/Student/StudentStore';
import validateStudentUpdate from './app/validators/Student/StudentUpdate';
import validatePlanStore from './app/validators/Plan/PlanStore';
import validatePlanUpdate from './app/validators/Plan/PlanUpdate';
import validateEnrollmentStore from './app/validators/Enrollment/EnrollmentStore';
import validateEnrollmentUpdate from './app/validators/Enrollment/EnrollmentUpdate';
import validateAnswerStore from './app/validators/AnswerStore';
import validateHelpOrderStore from './app/validators/HelpOrderStore';

const routes = new Router();

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

routes.post(
  '/students/:student_id/help-orders',
  validateHelpOrderStore,
  HelpOrderController.store
);

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

routes.get('/help-orders', HelpOrderController.index);
routes.get('/students/:student_id/help-orders', HelpOrderController.show);

routes.post(
  '/help-orders/:helpOrder_id/answer',
  validateAnswerStore,
  AnswerController.store
);

export default routes;
