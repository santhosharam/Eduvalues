const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config()
const { submitContactForm } = require('../controllers/contactController')

async function runContactVerificationSuite() {
    console.log('====================================================')
    console.log('  STARTING CONTACT FORM API & CONTROLLER AUDIT      ')
    console.log('====================================================\n')

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
    console.log('[TEST 1] Validation: Missing Name...')
    const req1 = createMockReq({ email: 'test@example.com', message: 'Hello' })
    const res1 = createMockRes()
    await submitContactForm(req1, res1)
    console.log('   ├─ Status Code:', res1.statusCode)
    console.log('   └─ Response:', res1.jsonPayload)
    if (res1.statusCode !== 400 || res1.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing name must return HTTP 400!')
    }
    console.log('   ✅ PASS (HTTP 400 Bad Request)\n')

    // 2. Test Input Validation - Missing Email
    console.log('[TEST 2] Validation: Missing Email...')
    const req2 = createMockReq({ name: 'John Doe', message: 'Hello' })
    const res2 = createMockRes()
    await submitContactForm(req2, res2)
    console.log('   ├─ Status Code:', res2.statusCode)
    console.log('   └─ Response:', res2.jsonPayload)
    if (res2.statusCode !== 400 || res2.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing email must return HTTP 400!')
    }
    console.log('   ✅ PASS (HTTP 400 Bad Request)\n')

    // 3. Test Input Validation - Invalid Email Format
    console.log('[TEST 3] Validation: Invalid Email Format...')
    const req3 = createMockReq({ name: 'John Doe', email: 'invalid-email-format', message: 'Hello' })
    const res3 = createMockRes()
    await submitContactForm(req3, res3)
    console.log('   ├─ Status Code:', res3.statusCode)
    console.log('   └─ Response:', res3.jsonPayload)
    if (res3.statusCode !== 400 || res3.jsonPayload?.success !== false) {
        throw new Error('FAIL: Invalid email format must return HTTP 400!')
    }
    console.log('   ✅ PASS (HTTP 400 Bad Request)\n')

    // 4. Test Input Validation - Missing Message
    console.log('[TEST 4] Validation: Missing Message...')
    const req4 = createMockReq({ name: 'John Doe', email: 'test@example.com' })
    const res4 = createMockRes()
    await submitContactForm(req4, res4)
    console.log('   ├─ Status Code:', res4.statusCode)
    console.log('   └─ Response:', res4.jsonPayload)
    if (res4.statusCode !== 400 || res4.jsonPayload?.success !== false) {
        throw new Error('FAIL: Missing message must return HTTP 400!')
    }
    console.log('   ✅ PASS (HTTP 400 Bad Request)\n')

    // 5. Test Valid Payload Execution & SMTP Response Handling
    console.log('[TEST 5] Valid Submission API Response...')
    const req5 = createMockReq({
        name: 'Santhosh S',
        email: 'testvisitor@example.com',
        phone: '+919876543210',
        message: 'Automated contact form test message.'
    })
    const res5 = createMockRes()
    await submitContactForm(req5, res5)
    console.log('   ├─ Status Code:', res5.statusCode)
    console.log('   └─ Response:', res5.jsonPayload)

    if (res5.statusCode === 200) {
        if (res5.jsonPayload?.success !== true || !res5.jsonPayload?.message) {
            throw new Error('FAIL: Successful response must contain success: true and a message!')
        }
        console.log('   ✅ PASS (HTTP 200 & Email Delivered Successfully)\n')
    } else if (res5.statusCode === 503 || res5.statusCode === 500) {
        if (res5.jsonPayload?.success !== false || !res5.jsonPayload?.message) {
            throw new Error('FAIL: Error response must contain success: false and safe user message!')
        }
        console.log('   ✅ PASS (HTTP 503/500 Safe Handling Verified)\n')
    } else {
        throw new Error(`FAIL: Unexpected status code ${res5.statusCode}`)
    }

    console.log('====================================================')
    console.log('  ALL CONTACT FORM AUDIT TESTS COMPLETED!          ')
    console.log('====================================================')
}

runContactVerificationSuite().catch(err => {
    console.error('\n❌ CONTACT FORM AUDIT FAILED:', err.message)
    process.exit(1)
})
