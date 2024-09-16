import { Router } from 'express';
import { getAllServices, postService, putService, deleteService } from '../controller/serviceController.js';

const routerServices = Router();

routerServices.get('/service', getAllServices);
routerServices.post('/service', postService);
routerServices.put('/service/:id', putService);
routerServices.delete('/service/:id', deleteService);
// routerServices.get('/services/:id', getServicesById);

export default routerServices;