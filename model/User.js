import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol'
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('User', userSchema, 'user');
