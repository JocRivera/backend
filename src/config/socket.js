import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
    io = new SocketServer(server, {
        cors: {
            origin: process.env.CLIENT_URL || "https://r6q0x0dq-5173.use2.devtunnels.ms/",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log('New client connected:', socket.id);

        const token = socket.handshake.auth.token;

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                console.log('User authenticated:', {
                    id: decoded.id,
                    role: decoded.role,
                    email: decoded.email,
                    name: decoded.name
                });

                // Unir admin a la sala admin
                if (decoded.role === 'admin') {
                    socket.join('admin');
                    console.log(`Admin ${decoded.email} joined admin room`);
                    socket.emit('message', 'Welcome Admin - Connected to notifications');
                } else {
                    console.log(`Regular user ${decoded.email} connected`);
                }

                // Guardar datos del usuario en el socket
                socket.userId = decoded.id;
                socket.userRole = decoded.role;
                socket.userEmail = decoded.email;
                socket.userName = decoded.name;

            } else {
                console.log('No token provided - guest connection');
            }
        } catch (error) {
            console.error('Socket authentication error:', error.message);
            socket.emit('auth_error', 'Invalid token');
        }

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getSocket = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized. Call initSocket(server) first.");
    }
    return io;
};