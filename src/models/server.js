import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "../config/db.js";
import authRoutes from "../routes/auth.routes.js";
import cartRoutes from "../routes/cart.routes.js";
import productRoutes from "../routes/product.routes.js";
import orderRoutes from "../routes/order.routes.js";
import morgan from "morgan";
import { createServer } from "http";
import { initSocket } from "../config/socket.js";
import paymentRoutes from "../routes/payment.routes.js"; // Importar rutas de pagos

class Server {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = initSocket(this.server); // Aquí ya se manejan todos los eventos de socket
    this.config();
    this.routes();
    // ❌ REMOVE: No duplicar eventos de socket aquí
    // this.socketEvents();
  }

  config() {
    dotenv.config();
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://lxwb2d7k-5173.use2.devtunnels.ms",
        ],
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(cookieParser());
    dbConnect();
  }

  routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/cart", cartRoutes);
    this.app.use("/api/products", productRoutes);
    this.app.use("/api/orders", orderRoutes);
    this.app.use("/api/payments", paymentRoutes); // Agregar ruta de pagos
  }

  // ❌ REMOVE: Esta función duplica los eventos ya manejados en socket.js
  // socketEvents() {
  //     this.io.on('connection', (socket) => {
  //         console.log('New client connected:', socket.id);
  //         socket.on('disconnect', () => {
  //             console.log('Client disconnected:', socket.id);
  //         });
  //     })
  // }

  start() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  }
}

export default Server;
