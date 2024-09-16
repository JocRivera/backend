import { Router } from "express";
import { getAllAmenities, createAmenities, updateAmenities, deleteAmenities, getAmenitiesById } from '../controller/amenitiesController.js';

const routerAmenities = Router();

routerAmenities.get('/amenities', getAllAmenities);
routerAmenities.post('/amenities', createAmenities);
routerAmenities.put('/amenities/:id', updateAmenities);
routerAmenities.delete('/amenities/:id', deleteAmenities);
routerAmenities.get('/amenities/:id', getAmenitiesById);

export default routerAmenities;