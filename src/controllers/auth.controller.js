import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    constructor() { }

    async Register(req, res) {
        try {
            const { email, password } = req.body;
            const crypt = await bcrypt.hash(password, 10);
            const user = new User({
                name: req.body.name,
                email,
                password: crypt,
                role: req.body.role || 'user'
            });
            const savedUser = await user.save();

            // ✅ INCLUIR role y email en el token
            jwt.sign({
                id: savedUser._id,
                role: savedUser.role,
                email: savedUser.email,
                name: savedUser.name
            }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Error generating token' });
                }
                res.json({
                    token,
                    user: {
                        id: savedUser._id,
                        name: savedUser.name,
                        email: savedUser.email,
                        role: savedUser.role
                    }
                });
            });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    }

    async Login(req, res) {
        const { email, password } = req.body;
        try {
            const userFound = await User.findOne({ email });
            if (!userFound) return res.status(400).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, userFound.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

            // ✅ INCLUIR role, email y name en el token
            const token = jwt.sign({
                id: userFound._id,
                role: userFound.role,
                email: userFound.email,
                name: userFound.name
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // solo secure en producción
                sameSite: 'lax',
                maxAge: 3600000 // 1 hora en millisegundos
            });

            res.json({
                token,
                user: {
                    id: userFound._id,
                    name: userFound.name,
                    email: userFound.email,
                    role: userFound.role
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    async Logout(req, res) {
        try {
            res.clearCookie('token');
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error logging out', error });
        }
    }

    async RefreshToken(req, res) { }

    async verifyToken(req, res) {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            const userFound = await User.findById(decoded.id);
            if (!userFound) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                user: {
                    id: userFound._id,
                    name: userFound.name,
                    email: userFound.email,
                    role: userFound.role
                }
            });
        })
    }
}