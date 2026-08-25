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

// Configuration for Nodemailer, adaptable for SMTP (e.g., Gmail) or transactional 
// providers such as SendGrid/Resend.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email SMTP connection failed. Check your EMAIL_USER/EMAIL_PASS settings:', error.message)
    } else {
        console.log('✅ Email SMTP server is ready to deliver messages')
    }
})

/**
 * Unified email sending function that provides standardized error handling
 * and fallback mechanisms for all platform communications.
 */
const sendEmail = async ({ to, subject, html, text, replyTo, attachments = [] }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"EduValues Support" <${process.env.EMAIL_USER || 'eduvalues123@gmail.com'}>`,
            to,
            replyTo,
            subject,
            text,
            html,
            attachments
        })
        console.log('✅ Email sent successfully:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('❌ Failed to send email:', error.message)
        return { success: false, error: error.message }
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
     * Automation trigger for contact form submissions.
     */
    sendContactSubmission: async ({ name, email, phone, message }) => {
        const contactEmail = 'eduvalues123@gmail.com'
        const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        return await sendEmail({
            to: contactEmail,
            replyTo: email,
            subject: 'New Contact Form Submission - EduValues',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #001F3F; margin-bottom: 16px;">New Contact Message Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                    <p><strong>Date/Time:</strong> ${dateStr}</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
                </div>
            `,
            text: `New Contact Message from ${name} (${email})\nPhone: ${phone || 'N/A'}\nDate: ${dateStr}\n\nMessage:\n${message}`
        })
    }
}

module.exports = {
    emailAutomation
}
