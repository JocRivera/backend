import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.js"; // Necesario para obtener req.user.id

const orderRoutes = Router();
const orderController = new OrderController();

// Ruta existente para crear una orden (ej. para pagos directos)
orderRoutes.post("/", verifyToken, orderController.createOrder);

// ⭐ NUEVA RUTA para manejar la confirmación de pago de Mercado Pago
// Esta ruta es llamada desde tu frontend (CheckoutSuccess.jsx) después de la redirección de MP
// Es CRÍTICO que el middleware verifyToken se ejecute aquí para que req.user.id esté disponible.
orderRoutes.post("/create-from-mercadopago", verifyToken, orderController.createOrderFromMercadoPago);

// Rutas existentes para obtener órdenes
orderRoutes.get("/:id", verifyToken, orderController.getOrder);
orderRoutes.get("/", verifyToken, orderController.getUserOrders);

export default orderRoutes;