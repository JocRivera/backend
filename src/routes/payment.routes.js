import {Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
const paymentRoutes = Router();
const paymentController = new PaymentController();

paymentRoutes.post('/create', paymentController.createPayment);

export default paymentRoutes;