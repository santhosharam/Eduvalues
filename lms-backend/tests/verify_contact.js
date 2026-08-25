require('dotenv').config()
const { emailAutomation } = require('../utils/emailService')
const { submitContactForm } = require('../controllers/contactController')

async function runContactVerificationSuite() {
    console.log('====================================================')
    console.log('  STARTING CONTACT FORM AUDIT SUITE                 ')
    console.log('====================================================\n')

    // Helper mock objects
    const createMockReq = (body) => ({ body })
    const createMockRes = () => {
        const res = {
            statusCode: 200,
            jsonPayload: null,
            status(code) {
                res.statusCode = code
                return res
            },
            json(data) {
                res.jsonPayload = data
                return res
            }
        }
        return res
    }

    // 1. Test Input Validation - Missing Name
    console.log('[TEST 1] Testing Validation: Missing Name...')
    const req1 = createMockReq({ email: 'test@example.com', message: 'Hello' })
    const res1 = createMockRes()
    await submitContactForm(req1, res1)
    console.log('   └─ Status Code:', res1.statusCode)
    console.log('   └─ Response:', res1.jsonPayload)
    if (res1.statusCode !== 400 || res1.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing name should return 400 Bad Request!')
    }
    console.log('   ✅ RESULT: PASS (HTTP 400)\n')

    // 2. Test Input Validation - Missing Email
    console.log('[TEST 2] Testing Validation: Missing Email...')
    const req2 = createMockReq({ name: 'John Doe', message: 'Hello' })
    const res2 = createMockRes()
    await submitContactForm(req2, res2)
    console.log('   └─ Status Code:', res2.statusCode)
    if (res2.statusCode !== 400 || res2.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing email should return 400 Bad Request!')
    }
    console.log('   ✅ RESULT: PASS (HTTP 400)\n')

    // 3. Test Input Validation - Invalid Email Format
    console.log('[TEST 3] Testing Validation: Invalid Email Format...')
    const req3 = createMockReq({ name: 'John Doe', email: 'invalid-email-format', message: 'Hello' })
    const res3 = createMockRes()
    await submitContactForm(req3, res3)
    console.log('   └─ Status Code:', res3.statusCode)
    if (res3.statusCode !== 400 || res3.jsonPayload?.success !== false) {
        throw new Error('FAIL: Invalid email format should return 400 Bad Request!')
    }
    console.log('   ✅ RESULT: PASS (HTTP 400)\n')

    // 4. Test Input Validation - Missing Message
    console.log('[TEST 4] Testing Validation: Missing Message...')
    const req4 = createMockReq({ name: 'John Doe', email: 'test@example.com' })
    const res4 = createMockRes()
    await submitContactForm(req4, res4)
    console.log('   └─ Status Code:', res4.statusCode)
    if (res4.statusCode !== 400 || res4.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing message should return 400 Bad Request!')
    }
    console.log('   ✅ RESULT: PASS (HTTP 400)\n')

    // 5. Test Full Valid Contact Form Submission & Email Handoff
    console.log('[TEST 5] Testing Valid Contact Submission & Nodemailer Handoff...')
    const req5 = createMockReq({
        name: 'Santhosh S',
        email: 'testvisitor@example.com',
        phone: '+919876543210',
        message: 'This is an automated test message for EduValues contact form.'
    })
    const res5 = createMockRes()
    await submitContactForm(req5, res5)
    console.log('   └─ Status Code:', res5.statusCode)
    console.log('   └─ Response:', res5.jsonPayload)

    if (res5.statusCode !== 200 || res5.jsonPayload?.success !== true) {
        throw new Error(`FAIL: Valid contact submission failed with status ${res5.statusCode}: ${JSON.stringify(res5.jsonPayload)}`)
    }
    console.log('   ✅ RESULT: PASS (HTTP 200 & Nodemailer Handoff Verified)\n')

    console.log('====================================================')
    console.log('  ALL CONTACT FORM AUDIT TESTS PASSED 100%!         ')
    console.log('====================================================')
}

runContactVerificationSuite().catch(err => {
    console.error('\n❌ CONTACT FORM AUDIT FAILED:', err.message)
    process.exit(1)
})
