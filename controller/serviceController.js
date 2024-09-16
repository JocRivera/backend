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

    putService = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedService = await this.service.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedService) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.json(updatedService); // Retornar el servicio actualizado
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    deleteService = async (req, res) => {
        try {
            const { id } = req.params;
            await this.service.deleteOne({ _id: id });
            res.json({ message: 'Service deleted' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ServiceController;