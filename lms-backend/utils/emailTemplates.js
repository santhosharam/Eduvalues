/**
 * Highly stylized HTML email templates matching the EduValues brand.
 * Converted to CommonJS module format for seamless Node.js runtime support.
 */

const BRAND_NAVY = '#001F3F'
const BRAND_TEAL = '#00A6C0'
const BG_COLOR = '#F4F7F9'
const CARD_BG = '#FFFFFF'
const TEXT_MUTED = '#6B7280'
const TEXT_DARK = '#1F2937'

const headerHTML = (title) => `
    <div style="background: linear-gradient(135deg, ${BRAND_NAVY} 0%, #002d5c 100%); padding: 48px 32px; text-align: center; border-radius: 20px 20px 0 0;">
        <div style="font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0; font-family: 'Outfit', 'Inter', -apple-system, sans-serif;">
            ${title}
        </div>
    </div>
`

const footerHTML = `
    <div style="margin-top: 40px; text-align: center; color: ${TEXT_MUTED}; font-size: 13px; padding: 24px; border-top: 1px solid #E5E7EB; font-family: 'Inter', -apple-system, sans-serif;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: ${BRAND_NAVY};">EduValues Learning Experience Platform</p>
        <p style="margin: 0 0 16px 0; font-size: 12px; line-height: 1.5;">Empowering curious minds to explore ethical values and grow into tomorrow's leaders.</p>
        <p style="margin: 0 0 16px 0; font-size: 11px;">Chennai, India • <a href="mailto:eduvalues123@gmail.com" style="color: ${BRAND_TEAL}; text-decoration: none; font-weight: 600;">eduvalues123@gmail.com</a></p>
        <div style="margin-top: 12px;">
            <a href="#" style="color: ${BRAND_TEAL}; text-decoration: none; margin: 0 12px; font-weight: 600;">Privacy Policy</a> | 
            <a href="#" style="color: ${BRAND_TEAL}; text-decoration: none; margin: 0 12px; font-weight: 600;">Terms of Service</a>
        </div>
    </div>
`

const welcomeTemplate = (userName) => `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: ${TEXT_DARK};">
        <div style="max-width: 600px; margin: 0 auto; background: ${CARD_BG}; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.04); border: 1px solid #E5E7EB;">
            <!-- Premium Header -->
            ${headerHTML(`Welcome to the Playground, ${userName}! 🚀`)}

            <div style="padding: 40px 32px;">
                <h2 style="color: ${BRAND_NAVY}; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; letter-spacing: -0.3px;">Your Adventure Starts Today!</h2>
                <p style="font-size: 15px; line-height: 1.7; color: #4B5563; margin: 0 0 24px 0;">
                    We are absolutely thrilled to have you join our community. **EduValues** is a space designed for curious young minds to explore character-building lessons, moral achievements, and grow into the leaders of tomorrow.
                </p>
                
                <div style="margin: 32px 0; padding: 24px; background: rgba(0, 166, 192, 0.05); border-radius: 14px; border-left: 4px solid ${BRAND_TEAL};">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">
                        <strong>Quick Start Guide:</strong><br> 
                        Explore our engaging modules, track your weekly progress, and complete interactive moral checkpoints to unlock certificates.
                    </p>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                    <a href="http://localhost:5173/courses" style="display: inline-block; background: ${BRAND_TEAL}; color: #FFFFFF; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 8px 16px rgba(0, 166, 192, 0.2); letter-spacing: 0.5px;">DISCOVER COURSES</a>
                </div>
            </div>

            ${footerHTML}
        </div>
    </div>
`

const enrollmentTemplate = (userName, courseName) => `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: ${TEXT_DARK};">
        <div style="max-width: 600px; margin: 0 auto; background: ${CARD_BG}; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.04); border: 1px solid #E5E7EB;">
            <!-- Premium Header -->
            ${headerHTML(`Enrollment Confirmed! ✅`)}

            <div style="padding: 40px 32px;">
                <p style="font-size: 15px; line-height: 1.7; color: #4B5563; margin: 0 0 24px 0;">
                    Hi <strong>${userName}</strong>, <br><br>
                    You have successfully enrolled in <strong>${courseName}</strong>! All lessons, quizzes, and learning checkpoints are now fully unlocked and waiting for you on your student dashboard.
                </p>

                <div style="margin: 32px 0; padding: 24px; background: rgba(0, 31, 63, 0.03); border-radius: 14px; border-left: 4px solid ${BRAND_NAVY};">
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #374151;">
                        <strong>Course Details:</strong><br>
                        • <strong>Title:</strong> ${courseName}<br>
                        • <strong>Access:</strong> Lifetime Interactive Access
                    </p>
                </div>

                <div style="text-align: center; margin-top: 32px;">
                    <a href="http://localhost:5173/dashboard/my-courses" style="display: inline-block; background: ${BRAND_NAVY}; color: #FFFFFF; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 8px 16px rgba(0, 31, 63, 0.15); letter-spacing: 0.5px;">GO TO LESSONS</a>
                </div>
            </div>

            ${footerHTML}
        </div>
    </div>
`

const completionTemplate = (userName, courseName, certificateLink) => `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: ${TEXT_DARK};">
        <div style="max-width: 600px; margin: 0 auto; background: ${CARD_BG}; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.04); border: 1px solid #E5E7EB;">
            <!-- Premium Gradient Header -->
            <div style="background: linear-gradient(135deg, ${BRAND_NAVY} 0%, ${BRAND_TEAL} 100%); padding: 56px 32px; text-align: center; border-radius: 20px 20px 0 0;">
                <div style="font-size: 32px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0; font-family: 'Outfit', 'Inter', -apple-system, sans-serif;">
                    CONGRATULATIONS! 🏆
                </div>
                <div style="font-size: 16px; color: #E5E7EB; font-weight: 600; font-family: 'Inter', -apple-system, sans-serif;">
                    Course Completed Successfully
                </div>
            </div>

            <div style="padding: 40px 32px; text-align: center;">
                <h2 style="color: ${BRAND_NAVY}; font-size: 24px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.3px;">You are now Certified!</h2>
                <p style="font-size: 15px; line-height: 1.7; color: #4B5563; margin: 0 auto 32px auto; max-width: 480px;">
                    Outstanding job, <strong>${userName}</strong>! You have successfully completed <strong>${courseName}</strong> and conquered the final moral compass challenge. 
                </p>

                <div style="margin: 32px auto; border: 2px dashed ${BRAND_TEAL}; border-radius: 16px; padding: 24px; max-width: 440px; background: rgba(0, 166, 192, 0.02);">
                    <p style="font-size: 13px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin: 0 0 8px 0;">Official Digital Certificate</p>
                    <a href="${certificateLink}" style="color: ${BRAND_TEAL}; font-weight: 800; font-size: 18px; text-decoration: underline; font-family: 'Outfit', sans-serif;">Download Certified PDF</a>
                </div>

                <div style="margin-top: 32px;">
                    <a href="http://localhost:5173/dashboard" style="display: inline-block; background: ${BRAND_NAVY}; color: #FFFFFF; padding: 16px 36px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 8px 16px rgba(0, 31, 63, 0.15);">BACK TO DASHBOARD</a>
                </div>
            </div>

            ${footerHTML}
        </div>
    </div>
`

module.exports = {
    welcomeTemplate,
    enrollmentTemplate,
    completionTemplate
}
