import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/auth.js';
const cartRoutes = Router();
const cartController = new CartController();

cartRoutes.post('/create', verifyToken, cartController.createCart);
cartRoutes.post('/add', verifyToken, cartController.addProductToCart);
cartRoutes.post('/remove', verifyToken, cartController.removeProductFromCart);
cartRoutes.post('/sync', verifyToken, cartController.syncCart);
cartRoutes.get('/', verifyToken, cartController.getCart);
cartRoutes.get('/user/', cartController.getUserCart);
cartRoutes.delete('/clear', cartController.clearCart);

export default cartRoutes;