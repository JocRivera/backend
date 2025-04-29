import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js";


export class CartController {
    constructor() { }

    async createCart(req, res) {
        try {
            const userId = req.user.id;
            const existingCart = await Cart.findOne({ user: userId });
            if (existingCart) return res.status(200).json(existingCart);

            const cart = new Cart({ user: userId });
            const savedCart = await cart.save();
            res.status(201).json(savedCart);
        } catch (error) {
            res.status(500).json({ message: 'Error creating cart', error });
        }
    }


    async addProductToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cart = await Cart.findOne({ user: userId }) || await new Cart({ user: userId }).save();
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: 'Error adding product to cart', error });
        }
    }

    async removeProductFromCart(req, res) {
        try {
            const { cartId } = req.params;
            const { productId } = req.body;
            const cart = await Cart.findById(cartId);
            if (!cart) return res.status(404).json({ message: 'Cart not found' });
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: 'Error removing product from cart', error });
        }
    }

    async getCart(req, res) {
        try {
            const userId = req.user.id; // Obtener el ID del usuario autenticado
            const cart = await Cart.findOne({ user: userId }).populate('products.product'); // Populate los productos

            if (!cart) return res.status(404).json({ message: 'Cart not found' });

            // Transformar la respuesta para que solo devuelva el formato deseado
            const formattedCart = cart.products.map(item => ({
                id: item.product.id.toString(), // Convertir ObjectId a string
                title: item.product.title, // Suponiendo que el producto tiene un campo 'title'
                quantity: item.quantity
            }));

            res.status(200).json({ cart: formattedCart });
        } catch (error) {
            res.status(500).json({ message: 'Error getting cart', error });
        }
    }



    async getUserCart(req, res) {
        try {
            const { userId } = req.params;
            const cart = await Cart.findOne({ user: userId }).populate('products.product');
            if (!cart) return res.status(404).json({ message: 'Cart not found' });
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: 'Error getting user cart', error });
        }
    }
    async clearCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await Cart.findById(cartId);
            if (!cart) return res.status(404).json({ message: 'Cart not found' });
            cart.products = [];
            const updatedCart = await cart.save();
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json({ message: 'Error clearing cart', error });
        }
    }
}