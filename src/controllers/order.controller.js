import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { getSocket } from "../config/socket.js";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-4126003856086907-081909-e368e86d70bf7996906a4bef3a874f33-2638908578",
});
const paymentInstance = new Payment(client); // Crea una instancia de Payment usando el cliente configurado

export class OrderController {
  constructor() {}

  async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const userName = req.user.name;
      const userEmail = req.user.email;
      const cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );
      const hbsOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: "./src/views/",
          defaultLayout: false,
        },
        viewPath: "./src/views/",
        extName: ".handlebars",
      };

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      const totalAmount = cart.products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      const order = new Order({
        user: userId,
        products: cart.products,
        totalAmount,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
      });

      const savedOrder = await order.save();

      // Vaciar carrito después de guardar la orden
      cart.products = [];
      await cart.save();

      // 💥 Emitir notificación a admins (sala "admin")
      const io = getSocket();

      io.to("admin").emit("newOrder", {
        orderId: savedOrder._id,
        total: savedOrder.totalAmount,
        createdAt: savedOrder.createdAt,
        user: req.user.name || req.user.email || `ID: ${req.user.id}`,
        message: `Nueva orden de ${req.user.name} por $${savedOrder.totalAmount}`,
        details: {
          products: savedOrder.products.map((item) => ({
            title: item.product.tittle,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: savedOrder.shippingAddress,
          paymentMethod: savedOrder.paymentMethod,
        },
      });

      // 📧 Enviar correo al admin (opcional)
      const transporter = nodemailer.createTransport({
        service: "gmail", // o usa un SMTP si es más profesional
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      transporter.use("compile", hbs(hbsOptions));
      await transporter.sendMail({
        from: `"Tienda Online" <${process.env.EMAIL_USER}>`,
        to: [process.env.ADMIN_EMAIL, userEmail],
        subject: "Nueva orden realizada",
        template: "orderConfirmation",
        context: {
          userName,
          orderId: savedOrder._id,
          totalAmount: savedOrder.totalAmount,
          products: savedOrder.products.map((item) => ({
            title: item.product.tittle,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: savedOrder.shippingAddress,
          paymentMethod: savedOrder.paymentMethod,
        },
      });

      return res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating order", error });
    }
  }
  // ⭐ NUEVO MÉTODO para manejar la confirmación de pago de Mercado Pago
  async createOrderFromMercadoPago(req, res) {
    const { paymentId, status, externalReference, merchantOrderId } = req.body;
    const hbsOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: "./src/views/",
        defaultLayout: false,
      },
      viewPath: "./src/views/",
      extName: ".handlebars",
    };

    try {
      // 1. **Verificar el pago con Mercado Pago (CRÍTICO para seguridad)**
      // Usa la instancia 'paymentInstance' que creaste
      const mpPaymentDetails = await paymentInstance.get({ id: paymentId }); // Forma correcta de llamar a 'get' con el ID

      // Accede al estado desde el objeto de detalles
      const mpPaymentStatus = mpPaymentDetails.status;

      if (mpPaymentStatus !== "approved") {
        console.log(
          "Pago no aprobado por Mercado Pago (estado real):",
          mpPaymentStatus
        );
        // Si el pago no está aprobado, no crees la orden.
        return res.status(400).json({
          message: "El pago no ha sido aprobado por Mercado Pago.",
          mpStatus: mpPaymentStatus,
        });
      }

      // 2. **Evitar duplicados**: Verifica si la orden ya existe (por mercadopagoPaymentId)
      const existingOrder = await Order.findOne({
        mercadopagoPaymentId: paymentId,
      });
      if (existingOrder) {
        console.log("Orden ya existe para este paymentId:", paymentId);
        return res.status(200).json({
          message: "La orden ya ha sido creada.",
          orderId: existingOrder._id,
          existing: true,
        });
      }

      // 3. **Recuperar la información del carrito/sesión del usuario**
      const userId = req.user.id; // Asumiendo que `verifyToken` ya puso el user en `req.user`
      const userName = req.user.name;
      const userEmail = req.user.email;
      const cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );

      if (!cart || cart.products.length === 0) {
        console.warn("Carrito no encontrado o vacío para el usuario:", userId);
        return res.status(404).json({
          message: "Carrito no encontrado o ya procesado para este usuario.",
        });
      }

      // 4. **Crear la nueva orden**
      const newOrder = new Order({
        user: userId,
        products: cart.products,
        totalAmount: mpPaymentDetails.transaction_amount, // Usa el monto real aprobado por MP
        shippingAddress: cart.shippingAddress || req.body.shippingAddress,
        paymentMethod: "MercadoPago",
        paymentStatus: mpPaymentStatus, // Será 'approved' aquí
        mercadopagoPaymentId: paymentId,
        mercadopagoMerchantOrderId: merchantOrderId,
        createdAt: new Date(),
      });

      const savedOrder = await newOrder.save();
      console.log(
        "Orden creada exitosamente por Mercado Pago:",
        savedOrder._id
      );

      // 5. **Vaciar carrito después de guardar la orden**
      cart.products = [];
      await cart.save();

      // 6. **Emitir notificación a admins (sala "admin")**
      const io = getSocket();
      io.to("admin").emit("newOrder", {
        orderId: savedOrder._id,
        total: savedOrder.totalAmount,
        createdAt: savedOrder.createdAt,
        user: req.user.name || req.user.email || `ID: ${req.user.id}`,
        message: `Nueva orden con Mercado Pago de ${req.user.name} por $${savedOrder.totalAmount}`,
        details: {
          products: savedOrder.products.map((item) => ({
            title: item.product.tittle,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: savedOrder.shippingAddress,
          paymentMethod: savedOrder.paymentMethod,
        },
      });

      // 7. **Enviar correo al admin (opcional)**
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      transporter.use("compile", hbs(hbsOptions));
      await transporter.sendMail({
        from: `"Tienda Online" <${process.env.EMAIL_USER}>`,
        to: [process.env.ADMIN_EMAIL, userEmail],
        subject: "Orden confirmada",
        template: "orderConfirmation",
        context: {
          userName,
          orderId: savedOrder._id,
          totalAmount: savedOrder.totalAmount,
          products: savedOrder.products.map((item) => ({
            title: item.product.tittle,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: savedOrder.shippingAddress,
          paymentMethod: savedOrder.paymentMethod,
        },
      });

      return res.status(201).json({
        message: "Orden creada exitosamente",
        orderId: savedOrder._id,
      });
    } catch (error) {
      console.error(
        "Error al procesar la confirmación de Mercado Pago:",
        error
      );
      res.status(500).json({
        message:
          "Error interno del servidor al procesar el pago de Mercado Pago",
        error: error.message,
      });
    }
  }

  async getOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId).populate("products.product");
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching order", error });
    }
  }
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ user: userId }).populate(
        "products.product"
      );
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching orders", error });
    }
  }
}
