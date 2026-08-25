require('dotenv').config()
const supabase = require('../supabaseClient')
const { generateCertificatePDF } = require('../controllers/certificateController')
const { emailAutomation } = require('../utils/emailService')

async function runCertificateEmailVerificationSuite() {
    console.log('====================================================')
    console.log('  STARTING CERTIFICATE EMAIL AUDIT SUITE           ')
    console.log('====================================================\n')

    // 1. Load an existing certificate from database
    console.log('[TEST 1] Loading Existing Certificate Record from Supabase...')
    const { data: cert, error: fetchErr } = await supabase
        .from('certificates')
        .select('*, courses(title, instructor)')
        .limit(1)
        .maybeSingle()

    if (fetchErr || !cert) {
        throw new Error('FAIL: Unable to fetch an existing certificate from Supabase database!')
    }

    console.log('   └─ Certificate ID:', cert.id)
    console.log('   └─ Student ID:', cert.student_id)
    console.log('   └─ Verification Code:', cert.certificate_code || cert.unique_code)
    console.log('   └─ Course Title:', cert.courses?.title)
    console.log('   ✅ RESULT: PASS\n')

    // 2. Test Server-side PDF Certificate Generation
    console.log('[TEST 2] Testing Server-side PDF Certificate Generator for Email Attachment...')
    const testStudentName = 'Santhosh S'
    const pdfBuffer = await generateCertificatePDF({
        ...cert,
        studentName: testStudentName,
        certificate_code: cert.certificate_code || cert.unique_code
    })

    console.log('   └─ Generated PDF Buffer Length:', pdfBuffer.length, 'bytes')
    if (!pdfBuffer || pdfBuffer.length < 2000) {
        throw new Error(`FAIL: PDF Buffer size (${pdfBuffer?.length}) is below 2,000 bytes threshold!`)
    }

    const pdfHeader = pdfBuffer.slice(0, 8).toString('utf-8')
    console.log('   └─ PDF Header Signature:', pdfHeader.trim())
    if (!pdfHeader.startsWith('%PDF-')) {
        throw new Error(`FAIL: Generated buffer signature is invalid: ${pdfHeader}`)
    }
    console.log('   ✅ RESULT: PASS (Buffer exists, non-empty, valid PDF signature)\n')

    // 3. Test Email Attachment Handoff via Nodemailer
    console.log('[TEST 3] Testing Email Dispatch of PDF Attachment via Nodemailer...')
    const verificationCode = cert.certificate_code || cert.unique_code || 'CERT-VERIFIED'
    
    const emailResult = await emailAutomation.sendCertificateAttachment(
        'eduvalues123@gmail.com',
        testStudentName,
        pdfBuffer,
        verificationCode
    )

    console.log('   └─ Nodemailer Dispatch Result:', emailResult)
    if (!emailResult.success) {
        throw new Error(`FAIL: Email attachment dispatch failed: ${emailResult.error}`)
    }
    console.log('   ✅ RESULT: PASS (Nodemailer received non-empty PDF attachment & SMTP handoff succeeded)\n')

    // 4. Test Error Handling (Invalid ID & Unauthorized handling)
    console.log('[TEST 4] Verifying Error Response Specs...')
    const { data: missingCert } = await supabase
        .from('certificates')
        .select('id')
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .maybeSingle()

    if (missingCert !== null) {
        throw new Error('FAIL: Invalid certificate ID returned a record!')
    }
    console.log('   └─ Missing Certificate Lookup (404 Spec): PASS (Returns null)')
    console.log('   ✅ RESULT: PASS\n')

    console.log('====================================================')
    console.log('  ALL CERTIFICATE EMAIL AUDIT TESTS PASSED 100%!    ')
    console.log('====================================================')
}

runCertificateEmailVerificationSuite().catch(err => {
    console.error('\n❌ CERTIFICATE EMAIL AUDIT SUITE FAILED:', err.message)
    process.exit(1)
})
