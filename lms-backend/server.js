require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

// Connect MongoDB
// Connect MongoDB
const startServer = async () => {
    try {
        await connectDB()

        // Security headers
        app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff')
            res.setHeader('X-Frame-Options', 'DENY')
            res.setHeader('X-XSS-Protection', '1; mode=block')
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            next()
        })

        // Middleware
        app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
            console.error(`[ERROR] ${req.method} ${req.url} — ${message}`)
            res.status(statusCode).json({
                success: false,
                message: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : message,
            })
        })

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => console.log(`🚀 LMS Server running on http://localhost:${PORT}`))
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

startServer()
