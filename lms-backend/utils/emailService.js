import nodemailer from 'nodemailer'
import {
    welcomeTemplate,
    enrollmentTemplate,
    completionTemplate
} from './emailTemplates.js'

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
    }
})

/**
 * Unified email sending function that provides standardized error handling
 * and fallback mechanisms for all platform communications.
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"EduValues" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
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
export const emailAutomation = {
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
    }
}
