import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';

const cartRoutes = Router();
const cartController = new CartController();

cartRoutes.post('/create/:userId', cartController.createCart);
cartRoutes.post('/add/:cartId', cartController.addProductToCart);
cartRoutes.post('/remove/:cartId', cartController.removeProductFromCart);
cartRoutes.get('/:cartId', cartController.getCart);
cartRoutes.get('/user/:userId', cartController.getUserCart);
cartRoutes.delete('/delete/:cartId', cartController.clearCart);

export default cartRoutes;