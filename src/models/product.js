import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    tittle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    collection: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    });

export default model('Product', productSchema);