import Service from '../model/Service.js';

export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.json({ message: 'Service created' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const putService = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(updatedService); // Retornar el servicio actualizado
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await Service.deleteOne({ _id: id });
        res.json({ message: 'Service deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


