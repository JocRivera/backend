import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export class OrderController {
    constructor() { }

    async createOrder(req, res) {
        try {
            const userId = req.user.id;
            const cart = await Cart.findOne
                ({ user: userId }).populate('products.product');
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
            const totalAmount = cart.products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
            const order = new Order({
                user: userId,
                products: cart.products,
                totalAmount,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
            });
            const savedOrder = await order.save();
            cart.products = [];
            await cart.save();
            res.status(201).json(savedOrder);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating order', error });
        }
    }

    async getOrder(req, res) {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId).populate('products.product');
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching order', error });
        }
    }
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;
            const orders = await Order.find({ user: userId }).populate('products.product');
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    }
}