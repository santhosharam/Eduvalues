const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config()
const nodemailer = require('nodemailer')
const {
    welcomeTemplate,
    enrollmentTemplate,
    completionTemplate
} = require('./emailTemplates')

/**
 * Robust Email Service configuration for EduValues, built for high-reliability 
 * email delivery of welcome messages, enrollment confirmations, and certificates.
 */

// Configuration for Nodemailer, supporting standard SMTP environment variables and fallbacks
const emailHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com'
const emailPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10)
const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || 'eduvalues123@gmail.com'
const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD
const isSecure = process.env.SMTP_SECURE === 'true' || process.env.EMAIL_SECURE === 'true' || emailPort === 465

const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: isSecure,
    auth: {
        user: emailUser,
        pass: emailPass
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Track latest verification status safely for diagnostic endpoints
let smtpStatus = {
    configured: Boolean(emailUser && emailPass),
    verified: false,
    host: emailHost,
    port: emailPort,
    secure: isSecure,
    user_configured: Boolean(emailUser && emailUser.trim()),
    pass_configured: Boolean(emailPass && emailPass.trim()),
    error: null
}

const sanitizeError = (err) => {
    if (!err) return {}
    const msg = String(err.message || err || '')
    const safeMsg = msg.replace(/(pass|password|auth|secret|token)[:=]\s*\S+/gi, '$1: ***')
    return {
        message: safeMsg,
        code: err.code || undefined,
        response: err.response ? String(err.response).replace(/(pass|password|auth|secret|token)[:=]\s*\S+/gi, '$1: ***') : undefined,
        responseCode: err.responseCode || undefined,
        command: err.command || undefined
    }
}

const verifyTransporter = () => {
    return new Promise((resolve) => {
        const hasUser = Boolean(emailUser && emailUser.trim())
        const hasPass = Boolean(emailPass && emailPass.trim())

        console.log(`[SMTP CONFIG] Host: ${emailHost}, Port: ${emailPort}, Secure: ${isSecure}, User Configured: ${hasUser}, Pass Configured: ${hasPass}`)

        if (!hasUser || !hasPass) {
            const safeErr = 'SMTP credentials missing (user or password not set in environment)'
            console.error(`❌ SMTP connection failed: ${safeErr}`)
            smtpStatus.verified = false
            smtpStatus.error = safeErr
            return resolve({ success: false, error: safeErr, status: smtpStatus })
        }

        transporter.verify((error, success) => {
            if (error) {
                const sErr = sanitizeError(error)
                console.error(`❌ SMTP connection failed: ${sErr.message}`)
                if (sErr.code) console.error(`   └─ Error Code: ${sErr.code}`)
                if (sErr.responseCode) console.error(`   └─ Response Code: ${sErr.responseCode}`)
                if (sErr.response) console.error(`   └─ Response: ${sErr.response}`)
                if (sErr.command) console.error(`   └─ Command: ${sErr.command}`)
                
                smtpStatus.verified = false
                smtpStatus.error = sErr.message
                resolve({ success: false, error: sErr.message, details: sErr, status: smtpStatus })
            } else {
                console.log('✅ SMTP connection verified successfully')
                smtpStatus.verified = true
                smtpStatus.error = null
                resolve({ success: true, status: smtpStatus })
            }
        })
    })
}

// Verify connection configuration on startup
verifyTransporter()

const getSmtpStatus = () => ({ ...smtpStatus })

/**
 * Unified email sending function that provides standardized error handling
 * and fallback mechanisms for all platform communications.
 */
const sendEmail = async ({ to, subject, html, text, replyTo, attachments = [] }) => {
    try {
        if (!emailUser || !emailPass) {
            const errStr = 'SMTP credentials missing in server environment variables.'
            console.error('❌ Failed to send email:', errStr)
            return { success: false, error: errStr }
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"EduValues Support" <${emailUser}>`,
            to,
            replyTo,
            subject,
            text,
            html,
            attachments
        })
        console.log('✅ Email sent successfully via SMTP. Message ID:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        const sErr = sanitizeError(error)
        console.error('❌ Failed to send email via SMTP:', sErr.message)
        if (sErr.code) console.error('   └─ Code:', sErr.code)
        if (sErr.responseCode) console.error('   └─ Response Code:', sErr.responseCode)
        if (sErr.response) console.error('   └─ Response:', sErr.response)
        if (sErr.command) console.error('   └─ Command:', sErr.command)
        return { success: false, error: sErr.message, details: sErr }
    }
}

/**
 * Direct automations for common platform events.
 */
const emailAutomation = {
    /** 
     * Automation trigger for a new student registration. 
     * Delivers the brand's 'Welcome to the Playground' message.
     */
    sendWelcome: async (userEmail, userName) => {
        return await sendEmail({
            to: userEmail,
            subject: 'Welcome to the Playground! 🚀 | EduValues',
            html: welcomeTemplate(userName),
            text: `Welcome to EduValues, ${userName}! We're thrilled to have you join our learning playground.`
        })
    },

    /**
     * Automation trigger for course enrollment confirmation.
     * Ensures students have immediate acknowledgement that their course access is unlocked.
     */
    sendEnrollmentConfirmation: async (userEmail, userName, courseName) => {
        return await sendEmail({
            to: userEmail,
            subject: `Enrollment Confirmed: ${courseName} ✅ | EduValues`,
            html: enrollmentTemplate(userName, courseName),
            text: `Hi ${userName}, you're now enrolled in ${courseName}. You can access your lessons in your dashboard.`
        })
    },

    /**
     * Automation trigger for course completion. 
     * Delivers student certificates directly to their inbox as a PDF-ready link.
     */
    sendCourseCompletion: async (userEmail, userName, courseName, certificateLink) => {
        return await sendEmail({
            to: userEmail,
            subject: `Congratulations on Completing ${courseName}! 🏆 | EduValues`,
            html: completionTemplate(userName, courseName, certificateLink),
            text: `Incredible job ${userName}! You've completed ${courseName}. View and download your certificate here: ${certificateLink}`
        })
    },

    /**
     * Automation trigger for emailing the PDF certificate attachment.
     */
    sendCertificateAttachment: async (userEmail, userName, pdfBuffer, uniqueCode) => {
        return await sendEmail({
            to: userEmail,
            subject: `Your EduValues Course Certificate - ${uniqueCode}`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;"><h2 style="color: #001F3F;">Congratulations, ${userName}! 🏆</h2><p>You have successfully completed your course on EduValues. Please find your official certificate attached to this email.</p><p style="margin-top: 20px; color: #64748b;">Verification Code: <strong>${uniqueCode}</strong></p><hr /><p style="font-size: 12px; color: #94a3b8;">EduValues LMS &bull; Character & Value Education</p></div>`,
            text: `Dear ${userName},\n\nCongratulations on successfully completing your course with EduValues!\n\nPlease find your course certificate attached to this email.\n\nVerification Code: ${uniqueCode}\n\nRegards,\nEduValues Team`,
            attachments: [
                {
                    filename: `Certificate_${userName.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        })
    },

    /**
     * Automation trigger for emailing the high-res PNG certificate image attachment.
     */
    sendCertificateImageAttachment: async (userEmail, userName, imageBuffer, uniqueCode) => {
        const sanitized = userName.replace(/[^a-zA-Z0-9_-]/g, '_')
        return await sendEmail({
            to: userEmail,
            subject: `Your EduValues Course Certificate - ${uniqueCode}`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;"><h2 style="color: #001F3F;">Congratulations, ${userName}! 🏆</h2><p>You have successfully completed your course on EduValues. Please find your official high-resolution certificate image attached to this email.</p><p style="margin-top: 20px; color: #64748b;">Verification Code: <strong>${uniqueCode}</strong></p><hr /><p style="font-size: 12px; color: #94a3b8;">EduValues LMS &bull; Character & Value Education</p></div>`,
            text: `Dear ${userName},\n\nCongratulations on successfully completing your course with EduValues!\n\nPlease find your official high-resolution course certificate image attached to this email.\n\nVerification Code: ${uniqueCode}\n\nRegards,\nEduValues Team`,
            attachments: [
                {
                    filename: `Certificate_${sanitized}.png`,
                    content: imageBuffer,
                    contentType: 'image/png'
                }
            ]
        })
    },

    /**
     * Automation trigger for contact form submissions.
     */
    sendContactSubmission: async ({ name, email, phone, message }) => {
        if (!name || typeof name !== 'string' || !name.trim()) {
            const err = new Error('Visitor name is required.')
            err.statusCode = 400
            throw err
        }
        if (!email || typeof email !== 'string' || !email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
            const err = new Error('A valid visitor email address is required.')
            err.statusCode = 400
            throw err
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
            const err = new Error('Contact message content is required.')
            err.statusCode = 400
            throw err
        }

        const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_TO || process.env.EMAIL_USER || process.env.SMTP_USER || 'eduvalues123@gmail.com'
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        
        // Escape HTML to prevent executable markup injection
        const escapeHtml = str => String(str || '').replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m])

        const safeName = escapeHtml(name.trim())
        const safeEmail = escapeHtml(email.trim())
        const safePhone = escapeHtml(phone ? phone.trim() : '')
        const safeMessage = escapeHtml(message.trim())

        console.log(`[CONTACT] Attempting SMTP delivery to '${receiverEmail}' with Reply-To '${safeEmail}'`)

        const result = await sendEmail({
            to: receiverEmail,
            replyTo: email.trim(),
            subject: `New Contact Form Submission - ${name.trim()}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px;">
                    <h2 style="color: #001F3F; margin-bottom: 16px;">New Contact Message Received</h2>
                    <p><strong>Name:</strong> ${safeName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                    ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
                    <p><strong>Date/Time:</strong> ${dateStr}</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${safeMessage}</p>
                </div>
            `,
            text: `New Contact Message from ${name.trim()} (${email.trim()})\nPhone: ${phone ? phone.trim() : 'N/A'}\nDate: ${dateStr}\n\nMessage:\n${message.trim()}`
        })

        if (!result.success) {
            console.error('[CONTACT] Email delivery failed:', result.error)
            const err = new Error(result.error || 'Failed to deliver contact email via SMTP.')
            err.details = result.details
            throw err
        }

        console.log('[CONTACT] Email sent successfully via Nodemailer. Message ID:', result.messageId)
        return result
    }
}

module.exports = {
    emailAutomation,
    verifyTransporter,
    getSmtpStatus,
    transporter
}

