import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // enum: ['habitaciones', 'cabaña', 'servicios', 'planes', 'reservas', 'usuarios', 'roles', 'permisos']
    },
    status: {
        type: Boolean,
        default: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol'  // Relación con roles
      }]
});

export default mongoose.model('Permission', permissionSchema, 'permission');