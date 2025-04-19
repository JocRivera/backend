import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from '../config/db.js';

class Server {
    constructor() {
        this.app = express();
        this.config();
    }
    config() {
        dotenv.config();
        this.app.use(cors());
        this.app.use(express.json());
        dbConnect();
    }
    start() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}
export default Server;