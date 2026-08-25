const { emailAutomation } = require('../utils/emailService')

// POST /api/contact - Public endpoint for visitor and student messages
exports.submitContactForm = async (req, res) => {
    try {
        console.log('[CONTACT] Request received:', req.body ? { name: req.body.name, email: req.body.email } : 'empty body')
        const { name, email, phone, message } = req.body || {}

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide your name.' })
        }
        if (!email || typeof email !== 'string' || !email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' })
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a message.' })
        }

        console.log('[CONTACT] Validation passed for visitor:', email.trim())

        const result = await emailAutomation.sendContactSubmission({
            name: name.trim(),
            email: email.trim(),
            phone: phone ? String(phone).trim() : '',
            message: message.trim()
        })

        if (result && result.success) {
            console.log('[CONTACT] API Returning 200 Success to client')
            return res.status(200).json({ success: true, message: 'Your message has been sent successfully.' })
        } else {
            console.error('[CONTACT_CONTROLLER_ERROR] Email delivery failed:', result?.error || 'Unknown error')
            return res.status(503).json({ success: false, message: 'Email service is temporarily unavailable. Please try again later.' })
        }
    } catch (err) {
        console.error('[CONTACT_FORM_EXCEPTION]', err?.message || err)
        if (err.details) {
            console.error('   └─ Error Details:', err.details)
        }
        if (err.statusCode === 400) {
            return res.status(400).json({ success: false, message: err.message })
        }
        return res.status(503).json({ success: false, message: 'Email service is temporarily unavailable. Please try again later.' })
    }
}

