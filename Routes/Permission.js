import { Router } from 'express';
import { getAllPermissions, postPermission, putPermission, deletePermission } from '../controller/permissionController.js';

const routerPermissions = Router();

routerPermissions.get('/permission', getAllPermissions);
routerPermissions.post('/permission', postPermission);
routerPermissions.put('/permission/:id', putPermission);
routerPermissions.delete('/permission/:id', deletePermission);

export default routerPermissions;
