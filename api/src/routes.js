import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.create);
routes.post('/sessions', SessionController.create);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.list);

routes.get('/appointments', AppointmentController.list);
routes.post('/appointments', AppointmentController.create);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.list);

routes.get('/notifications', NotificationController.list);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.create);

export default routes;
