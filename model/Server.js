import express, { json } from 'express';
import dbconnection from '../database/config.db.js';
import 'dotenv/config';
import morgan from 'morgan';
import routerAmenities  from '../Routes/Amenities.js'

import cors  from 'cors';



class Server {
    constructor() {
        this.app = express();
        this.app.use(json());
        this.app.use(morgan('dev'));
        this.dbconnection();
        this.routes();
        this.listen();
        this.cors();
       
    }

    async cors() {
        this.app.use(cors());
    }

  
    async dbconnection() {
        try {
            await dbconnection();
            console.log('Database connected');
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }

    routes(){
        this.app.use('/api',  routerAmenities);

    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }


}

export  default Server;
