let app
try {
    app = require('../lms-backend/server.js')
} catch (err) {
    console.error('Failed to load lms-backend:', err)
    const express = require('express')
    const fallbackApp = express()
    fallbackApp.use((req, res) => {
        res.status(500).json({
            success: false,
            error: 'Failed to load backend server',
            message: err.message,
            stack: err.stack
        })
    })
    app = fallbackApp
}
module.exports = app
