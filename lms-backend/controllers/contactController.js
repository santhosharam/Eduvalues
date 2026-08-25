const { emailAutomation } = require('../utils/emailService')

// POST /api/contact
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide your name.' })
        }
        if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address.' })
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Please write a message before sending.' })
        }

        const result = await emailAutomation.sendContactSubmission({
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '',
            message: message.trim()
        })

        if (result.success) {
            res.json({ success: true, message: 'Message Sent! We will reach out to your email shortly.' })
        } else {
            res.status(500).json({ success: false, message: 'Unable to send your message right now. Please try again.' })
        }
    } catch (err) {
        console.error('[CONTACT_FORM_ERROR]', err)
        res.status(500).json({ success: false, message: 'Unable to send your message right now. Please try again.' })
    }
}
