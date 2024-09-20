import Permission from '../model/Permission.js'

export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postPermission = async (req, res) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        res.json({ message: 'Permission created' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const putPermission = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPermission = await Permission.findByIdAndUpdate(id, req.body
            , { new: true });
        if (!updatedPermission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.json(updatedPermission); // Retornar el permiso actualizado
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        await Permission.deleteOne({
            _id:
                id
        });
        res.json({ message: 'Permission deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

