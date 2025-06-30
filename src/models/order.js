import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        street: String,
        city: String,
        zip: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Mercado Pago'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    }
}, {
    timestamps: true,
});

export default model('Order', orderSchema);