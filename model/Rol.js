import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
    rol: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    status: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Rol', rolSchema, 'rol');