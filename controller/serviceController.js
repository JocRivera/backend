//manejar las rutas de los servicios
const Service = require('../model/Service');

class ServiceController {
    constructor() {
        this.service = Service;
    }
    getAllServices = async (req, res) => {
        try {
            const services = await this.service.find();
            res.json(services);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    postService = async (req, res) => {
        try {
            const service = new this.service(req.body);
            await service.save();
            res.json({ message: 'Service created' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ServiceController;