const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
        const exists = await User.findOne({ email })
        if (exists) return res.status(409).json({ message: 'Email already registered' })
        const user = await User.create({ name, email, password })
        const token = signToken(user._id)
        res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
        const user = await User.findOne({ email })
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const token = signToken(user._id)
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ user: req.user })
}

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
    try {
        const { name, avatar } = req.body
        const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true }).select('-password')
        res.json({ user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/auth/forgot-password
// In production you would send an email — here we return the reset token directly
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ message: 'Email is required' })
        const user = await User.findOne({ email })
        // Always respond with success to prevent email enumeration
        if (!user) return res.json({ message: 'If that email is registered, a reset link has been sent.' })

        // Generate a plain reset token, store its hash
        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashed = crypto.createHash('sha256').update(resetToken).digest('hex')
        user.resetPasswordToken = hashed
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000 // 30 min
        await user.save({ validateBeforeSave: false })

        // TODO: Send email with resetToken. For now we return it (dev only)
        res.json({
            message: 'Password reset token generated. In production this would be emailed.',
            resetToken, // Remove this in production!
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
        const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex')
        const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } })
        if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' })
        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        res.json({ message: 'Password reset successful. Please log in.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
