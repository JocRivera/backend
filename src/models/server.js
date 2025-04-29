import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from '../config/db.js';
import authRoutes from '../routes/auth.routes.js';
import cartRoutes from '../routes/cart.routes.js';
import productRoutes from '../routes/product.routes.js';
import morgan from 'morgan';
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        dotenv.config();
        this.app.use(morgan('dev')); // 'dev' es un formato predefinido para logs
        this.app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true
        }));
        this.app.use(express.json());
        this.app.use(cookieParser());
        dbConnect();
    }
    routes() {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/cart', cartRoutes);
        this.app.use('/api/products', productRoutes);
    }

    start() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}
export default Server;