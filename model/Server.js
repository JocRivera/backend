const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const dbConnection = require('../database/database');
const Service = require('../controller/serviceController');
const { version } = require('mongoose');


class Server {
    constructor() {
        this.app = app;
        this.dbConnection();
        this.service = new Service();
        this.cors();
        this.routes();
    }

    async cors() {
        this.app.use(cors());
    }

    start() {
        this.app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
    async dbConnection() {
        try {
            await dbConnection();
            console.log('Connect to Mongo DB');
        }
        catch (error) {
            console.log(error);
        }
    }

    routes() {
        this.app.use(express.json())
        this.app.get('/', this.service.getAllServices
        );
        this.app.post('/', this.service.postService
        );


    }


}

module.exports = Server;