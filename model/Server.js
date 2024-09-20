import express, { json } from 'express';
import dbconnection from '../database/config.db.js';
import 'dotenv/config';
import morgan from 'morgan';
import routerAmenities from '../Routes/Amenities.js'
import routerServices from '../Routes/Services.js'
import routerRoles from '../Routes/Rol.js'
import routerPermissions from '../Routes/Permission.js'

import cors from 'cors';



class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.dbconnection();
        this.routes();
        this.start();
    }
    middleware() {
        this.app.use(json());
        this.app.use(morgan('dev'));
        this.app.use(cors()); // Configuración de CORS
    }
    start() {
        this.app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
    async cors() {
        this.app.use(cors());
    }


    async dbconnection() {
        try {
            await dbconnection();
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }

    routes() {
        this.app.use('/', routerAmenities);
        this.app.use('/', routerServices);
        this.app.use('/', routerRoles);
        this.app.use('/', routerPermissions);
    }


}

export default Server;
