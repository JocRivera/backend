import { Router } from 'express';
import { getAllRoles, postRol, putRol, deleteRol, patchRol } from '../controller/rolController.js';

const routerRoles = Router();

routerRoles.get('/rol', getAllRoles);
routerRoles.post('/rol', postRol);
routerRoles.put('/rol/:id', putRol);
routerRoles.delete('/rol/:id', deleteRol);
routerRoles.patch('/rol/:id', patchRol);

export default routerRoles;