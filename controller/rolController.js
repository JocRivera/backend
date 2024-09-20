import Rol from '../model/Rol.js';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postRol = async (req, res) => {
    try {
        const rol = new Rol(req.body);
        await rol.save();
        res.json({ message: 'Rol created' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const putRol = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRol = await Rol.findByIdAndUpdate(id, req.body
            , { new: true });
        if (!updatedRol) {
            return res.status(404).json({ message: 'Rol not found' });
        }
        res.json(updatedRol); // Retornar el rol actualizado
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        await Rol.deleteOne({ _id:
            id });
        res.json({ message: 'Rol deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const patchRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedRol = await Rol.findByIdAndUpdate
            (id, { status }, { new: true });
        if (!updatedRol) {
            return res.status(404).json({ message: 'Rol not found' });
        }
        res.json(updatedRol);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
