const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config()
const { verifyTransporter, emailAutomation, getSmtpStatus } = require('../utils/emailService')

async function runSmtpDiagnostic() {
    console.log('====================================================')
    console.log('  EDUVALUES SMTP CONNECTION & HANDOFF TEST SUITE   ')
    console.log('====================================================\n')

    const status = getSmtpStatus()
    console.log('SMTP Configuration Detected:')
    console.log(`   ├─ Host: ${status.host}`)
    console.log(`   ├─ Port: ${status.port}`)
    console.log(`   ├─ Secure: ${status.secure}`)
    console.log(`   ├─ User Configured: ${status.user_configured}`)
    console.log(`   └─ Pass Configured: ${status.pass_configured}\n`)

    console.log('Verifying SMTP Transporter Connection...')
    const verifyResult = await verifyTransporter()

    if (!verifyResult.success) {
        console.error('\n❌ SMTP connection failed:', verifyResult.error)
        if (verifyResult.details) {
            if (verifyResult.details.code) console.error(`   ├─ Error Code: ${verifyResult.details.code}`)
            if (verifyResult.details.responseCode) console.error(`   ├─ Response Code: ${verifyResult.details.responseCode}`)
            if (verifyResult.details.response) console.error(`   └─ Response: ${verifyResult.details.response}`)
        }
        process.exit(1)
    }

    console.log('✅ SMTP connection verified successfully!\n')

    const testReceiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_TO || process.env.EMAIL_USER || process.env.SMTP_USER || 'eduvalues123@gmail.com'
    console.log(`Sending controlled test email to receiver: ${testReceiver}...`)

    try {
        const sendResult = await emailAutomation.sendContactSubmission({
            name: 'SMTP Verification Test Suite',
            email: 'testsuite@eduvalues.in',
            phone: '0000000000',
            message: 'This is an automated SMTP verification test message from test_smtp.js script.'
        })

        if (sendResult && sendResult.success) {
            console.log('\n====================================================')
            console.log('✅ Test email sent successfully!')
            console.log(`   ├─ Receiver: ${testReceiver}`)
            console.log(`   └─ Message ID: ${sendResult.messageId}`)
            console.log('====================================================')
        } else {
            console.error('\n❌ SMTP Email handoff failed:', sendResult?.error || 'Unknown failure')
            process.exit(1)
        }
    } catch (err) {
        console.error('\n❌ Controlled test email sending failed with exception:', err.message)
        if (err.details) {
            console.error('   └─ Details:', err.details)
        }
        process.exit(1)
    }
}

runSmtpDiagnostic()
