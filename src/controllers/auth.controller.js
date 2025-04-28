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
            jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Error generating token' });
                }
                res.json({ token })
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
            const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: true });
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

    async VerifyToken(req, res) { }

}