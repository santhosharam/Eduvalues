const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const app = express()

// Initialization
console.log('⚡ Using Supabase as the primary database. [Build: 2026-05-13_14:50]')

// Security headers & Private Network Access support
app.use((req, res, next) => {
            console.log(`[REQUEST] ${req.method} ${req.url}`)
            
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('X-Frame-Options', 'DENY')
            res.setHeader('X-XSS-Protection', '1; mode=block')
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            
            // Allow Private Network Access (for local development with public frontend)
            if (req.headers['access-control-request-private-network']) {
                res.setHeader('Access-Control-Allow-Private-Network', 'true')
            }

            // Handle preflight for PNA
            if (req.method === 'OPTIONS' && req.headers['access-control-request-private-network']) {
                return res.sendStatus(204)
            }

            next()
        })

        // Rate Limiting
        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 100, // Limit each IP to 100 requests per windowMs
            message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
            standardHeaders: 'draft-7',
            legacyHeaders: false,
            handler: (req, res, next, options) => {
                res.status(options.statusCode).json(options.message);
            }
        })
        app.use('/api/', apiLimiter)

        const authLimiter = rateLimit({
            windowMs: 60 * 60 * 1000, // 1 hour
            limit: 5, // Limit each IP to 5 login attempts per hour
            message: { success: false, message: 'Too many login attempts, please try again after an hour' },
            handler: (req, res, next, options) => {
                res.status(options.statusCode).json(options.message);
            }
        })
        app.use('/api/auth/login', authLimiter)

        // Middleware
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
            'https://eduvalues.vercel.app',
            'https://www.eduvalues.in',
            'https://eduvalues.in'
        ].filter(Boolean)

        app.use(cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('Not allowed by CORS'))
                }
            },
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }))
        app.use(express.json({ limit: '5mb' }))
        app.use(morgan('dev'))

        // Routes
        app.use('/api/auth', require('./routes/authRoutes'))
        app.use('/api/courses', require('./routes/courseRoutes'))
        app.use('/api/lessons', require('./routes/lessonRoutes'))
        app.use('/api/enrollments', require('./routes/enrollmentRoutes'))
        app.use('/api/progress', require('./routes/progressRoutes'))
        app.use('/api/payments', require('./routes/paymentRoutes'))
        app.use('/api/certificates', require('./routes/certificateRoutes'))
        app.use('/api/assessments', require('./routes/assessmentRoutes'))
        app.use('/api/reviews', require('./routes/reviewRoutes'))
        app.use('/api/admin', require('./routes/adminRoutes'))
        app.use('/api/blogs', require('./routes/blogRoutes'))
        app.use('/api/contact', require('./routes/contactRoutes'))

        // Health check
        app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date(), version: '2.0.0' }))

        // Diagnostics endpoint to debug environment & SMTP status on hosted server safely
        const { getSmtpStatus } = require('./utils/emailService')
        app.get('/api/diagnose', (req, res) => {
            const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
            const razorpayKey = process.env.RAZORPAY_KEY_ID
            const razorpaySecret = process.env.RAZORPAY_KEY_SECRET
            
            const smtpStatus = getSmtpStatus ? getSmtpStatus() : {}

            res.json({
                status: 'ok',
                time: new Date(),
                smtp_configured: smtpStatus.configured || false,
                smtp_verified: smtpStatus.verified || false,
                smtp_host: smtpStatus.host || 'smtp.gmail.com',
                smtp_port: smtpStatus.port || 587,
                smtp_secure: smtpStatus.secure || false,
                smtp_user_configured: smtpStatus.user_configured || false,
                smtp_pass_configured: smtpStatus.pass_configured || false,
                smtp_error: smtpStatus.error || null,
                env: {
                    NODE_ENV: process.env.NODE_ENV,
                    VERCEL: process.env.VERCEL,
                    PORT: process.env.PORT,
                    SUPABASE_URL_configured: !!supabaseUrl,
                    SUPABASE_KEY_configured: !!supabaseKey,
                    RAZORPAY_KEY_configured: !!razorpayKey,
                    RAZORPAY_KEY_SECRET_configured: !!razorpaySecret,
                    EMAIL_USER_configured: smtpStatus.user_configured || false,
                    EMAIL_PASS_configured: smtpStatus.pass_configured || false
                }
            })
        })

        // 404 handler for unknown API routes
        app.use('/api', (req, res) => {
            // Only return JSON 404 if the request genuinely targeted the API
            res.status(404).json({ message: 'API endpoint not found' })
        })

        // Global error handler
        app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500
            const message = err.message || 'Internal Server Error'
            const errors = err.errors || null

            console.error(`[ERROR] ${req.method} ${req.url} — ${message}`)
            if (err.stack && process.env.NODE_ENV !== 'production') console.error(err.stack)

            res.status(statusCode).json({
                success: false,
                message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
                errors
            })
        })

const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`🚀 LMS Server running on port ${PORT}`))
}

module.exports = app
