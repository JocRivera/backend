import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.js";
const orderRoutes = Router();
const orderController = new OrderController();
orderRoutes.post("/", verifyToken, orderController.createOrder);
orderRoutes.get("/:id", verifyToken, orderController.getOrder);
orderRoutes.get("/", verifyToken, orderController.getUserOrders);

export default orderRoutes;