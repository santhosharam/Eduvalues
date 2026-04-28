require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

const app = express()

// Connect MongoDB
// Connect MongoDB
const startServer = async () => {
    try {
        await connectDB()

        // Security headers & Private Network Access support
        app.use((req, res, next) => {
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
            'https://eduvalues.vercel.app'
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
        app.use('/api/reviews', require('./routes/reviewRoutes'))
        app.use('/api/admin', require('./routes/adminRoutes'))

        // Health check
        app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date(), version: '2.0.0' }))

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
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => console.log(`🚀 LMS Server running on port ${PORT}`))
        }
    } catch (err) {
        console.error('Failed to start server:', err)
    }
}

startServer()

module.exports = app
