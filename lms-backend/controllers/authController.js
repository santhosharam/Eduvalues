const supabase = require('../supabaseClient')
const { emailAutomation } = require('../utils/emailService')

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: 'student' // Default role
                }
            }
        })

        if (error) throw error
        
        // Trigger Welcome Email automation in background (non-blocking)
        emailAutomation.sendWelcome(email, name).catch(err => {
            console.error('Failed to trigger welcome email automation:', err.message)
        })
        
        res.status(201).json({ 
            message: 'Registration successful', 
            user: data.user,
            session: data.session 
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) return res.status(401).json({ message: 'Invalid email or password' })
        
        res.json({ 
            message: 'Login successful', 
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name,
                role: data.user.user_metadata?.role || 'student'
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
    // req.user is already populated by authMiddleware
    res.json({ user: req.user })
}

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
    try {
        const { name, avatar } = req.body
        const { data, error } = await supabase.auth.updateUser({
            data: { full_name: name, avatar_url: avatar }
        })

        if (error) throw error
        res.json({ user: data.user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.CLIENT_URL}/reset-password`,
        })

        if (error) throw error
        res.json({ message: 'Password reset link sent to your email.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body
        const { error } = await supabase.auth.updateUser({ password })
        
        if (error) throw error
        res.json({ message: 'Password reset successful.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
