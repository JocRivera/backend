import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnect from '../config/db.js';

class Server {
    constructor() {
        this.app = express();
        this.config();
    }
    config() {
        dotenv.config();
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
    }

    start() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}
export default Server;