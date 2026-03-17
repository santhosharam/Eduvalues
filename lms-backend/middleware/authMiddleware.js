const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    // Guest Mode Bypass
    if (!token) {
        // Automatically assign the first admin user for development/guest access
        req.user = await User.findOne({ role: 'admin' })
        if (req.user) return next()
        return res.status(401).json({ message: 'No admin user found for guest access' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        if (!req.user) return res.status(401).json({ message: 'User not found' })
        next()
    } catch {
        res.status(401).json({ message: 'Token invalid or expired' })
    }
}

exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
    next()
}
