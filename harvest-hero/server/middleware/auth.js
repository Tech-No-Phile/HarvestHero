import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// verifying JWT token and attaching user to request
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, no token(Token is missing)' });
            }
            console.log("[HarvestHero] Token received, verifying...");
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token
            req.user = await User.findById(decoded.id).select('-password'); // get user from token password not necessary(exculde)
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error(`[HarvestHero] Auth Middleware Error: ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
};

// check and authorize users
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
