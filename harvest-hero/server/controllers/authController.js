import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'falback_secret', { expiresIn: '30d' });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if (!['farmer', 'vendor', 'landowner'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified, It must be one of: farmer, vendor, landowner' });
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
    }
    const user = await User.create({ username, email, password, role });
    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        }
    });
    } catch (error) {
        console.error(`[HarvestHero] Register Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during registration, Registration Failed' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            }
        });
    } catch (error) {
        console.error(`[HarvestHero] Login Error: ${error.message}`);
        res.status(500).json({ message: 'Server error during login, Login Failed' });
    }
};
export const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        });
    } catch (error) {        
        console.error(`[HarvestHero] GetMe Error: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching user data, Fetch Failed' });
    }
};