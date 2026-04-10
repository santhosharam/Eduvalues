/**
 * Highly stylized HTML email templates matching the EduValues brand.
 * Includes "Torn Paper" inspired visuals and the Navy/Teal brand palette.
 */

const LOGO_URL = 'https://eduvalues.in/logo.png' // Replace with your actual CDN logo URL
const BRAND_NAVY = '#001F3F'
const BRAND_TEAL = '#00A6C0'
const BG_COLOR = '#F4F7F9'

const footerHTML = `
    <div style="margin-top: 40px; text-align: center; color: #888; font-size: 12px; padding: 20px; border-top: 1px solid #eee;">
        <p>© 2026 EduValues. All rights reserved.</p>
        <p>Chennai, India • eduvalues123@gmail.com</p>
        <div style="margin-top: 10px;">
            <a href="#" style="color: #00A6C0; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
            <a href="#" style="color: #00A6C0; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        </div>
    </div>
`

export const welcomeTemplate = (userName) => `
    <div style="font-family: 'Quicksand', sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05);">
            {/* Header with Navy background */}
            <div style="background: ${BRAND_NAVY}; padding: 40px; text-align: center;">
                <img src="${LOGO_URL}" alt="EduValues" style="height: 60px; margin-bottom: 20px;">
                <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 800;">Welcome to the Playground, ${userName}!</h1>
            </div>

            <div style="padding: 40px;">
                <h2 style="color: ${BRAND_NAVY}; font-size: 22px; margin-bottom: 20px;">Your Adventure Starts Today! 🚀</h2>
                <p style="font-size: 16px; line-height: 1.8; color: #555;">
                    We're absolutely thrilled to have you join our community. EduValues is more than just a platform—it's a space where curious minds explore, learn ethical values, and grow into the leaders of tomorrow.
                </p>
                
                <div style="margin: 40px 0; padding: 30px; background: #00A6C010; border-radius: 16px; border-left: 4px solid ${BRAND_TEAL};">
                    <p style="margin: 0; font-size: 15px; color: #555;"><strong>Ready to jump in?</strong><br> Browse our latest insights or start your first course today!</p>
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/courses" style="display: inline-block; background: ${BRAND_TEAL}; color: #fff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 900; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 166, 192, 0.25);">DISCOVER COURSES</a>
                </div>
            </div>

            ${footerHTML}
        </div>
    </div>
`

export const enrollmentTemplate = (userName, courseName) => `
    <div style="font-family: 'Quicksand', sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05);">
            <div style="background: ${BRAND_NAVY}; padding: 40px; text-align: center;">
                <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 800;">Enrollment Confirmed! ✅</h2>
            </div>

            <div style="padding: 40px;">
                <p style="font-size: 16px; line-height: 1.8; color: #555;">
                    Hi <strong>${userName}</strong>, <br><br>
                    You're officially enrolled in <strong>${courseName}</strong>! Your materials are now unlocked and ready for you in your dashboard.
                </p>

                <div style="text-align: center; margin: 40px 0;">
                    <a href="http://localhost:5173/dashboard/my-courses" style="display: inline-block; background: ${BRAND_NAVY}; color: #fff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 900; font-size: 16px;">GO TO LESSONS</a>
                </div>
            </div>

            ${footerHTML}
        </div>
    </div>
`

export const completionTemplate = (userName, courseName, certificateLink) => `
    <div style="font-family: 'Quicksand', sans-serif; background: ${BG_COLOR}; padding: 40px 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, ${BRAND_NAVY} 0%, ${BRAND_TEAL} 100%); padding: 60px 40px; text-align: center;">
                <h1 style="color: #fff; margin: 0; font-size: 32px; font-weight: 900;">AMAZING JOB, ${userName}! 🏆</h1>
            </div>

            <div style="padding: 40px; text-align: center;">
                <h2 style="color: ${BRAND_NAVY}; font-size: 24px; margin-bottom: 20px;">You are now Certified!</h2>
                <p style="font-size: 16px; line-height: 1.8; color: #555;">
                    You have successfully completed <strong>${courseName}</strong> with full marks! This is an incredible milestone in your educational journey.
                </p>

                <div style="margin: 40px 0; border: 2px dashed ${BRAND_TEAL}; border-radius: 24px; padding: 30px;">
                    <p style="font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Your Digital Certificate</p>
                    <a href="${certificateLink}" style="color: ${BRAND_TEAL}; font-weight: 800; font-size: 18px; text-decoration: underline;">View & Download PDF</a>
                </div>

                <a href="http://localhost:5173/dashboard" style="display: inline-block; background: ${BRAND_NAVY}; color: #fff; padding: 18px 40px; border-radius: 50px; text-decoration: none; font-weight: 900; font-size: 16px;">BACK TO DASHBOARD</a>
            </div>

            ${footerHTML}
        </div>
    </div>
`
