require('dotenv').config()
const { PDFParse } = require('pdf-parse')
const { generateCertificatePDF } = require('../controllers/certificateController')
const { emailAutomation } = require('../utils/emailService')

async function runCertificateVerificationSuite() {
    console.log('====================================================')
    console.log('  STARTING COMPREHENSIVE CERTIFICATE AUDIT SUITE    ')
    console.log('====================================================\n')

    const testCases = [
        {
            label: 'Normal Name & Normal Course',
            cert: {
                studentName: 'SANTHOSH S',
                courses: { title: 'Character Builders: Essential Life Values for Kids', instructor: 'EduValues Team' },
                unique_code: 'CERT-2026-NORMAL',
                issued_at: new Date()
            }
        },
        {
            label: 'Long Student Name',
            cert: {
                studentName: 'Alexander Christopher Benjamin Jonathan William Smith',
                courses: { title: 'Character Builders: Essential Life Values for Kids', instructor: 'EduValues Team' },
                unique_code: 'CERT-2026-LONGNAME',
                issued_at: new Date()
            }
        },
        {
            label: 'Long Course Title',
            cert: {
                studentName: 'SANTHOSH S',
                courses: { title: 'Character Builders: Essential Life Values for Kids and Advanced Personal Development Program', instructor: 'EduValues Team' },
                unique_code: 'CERT-2026-LONGCOURSE',
                issued_at: new Date()
            }
        },
        {
            label: 'Both Long Student Name & Long Course Title',
            cert: {
                studentName: 'Alexander Christopher Benjamin Jonathan William Smith',
                courses: { title: 'Character Builders: Essential Life Values for Kids and Advanced Personal Development Program', instructor: 'EduValues Team' },
                unique_code: 'CERT-2026-BOTHLONG',
                issued_at: new Date()
            }
        }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i]
        console.log(`[TEST ${i + 1}] Evaluating: ${tc.label}`)

        // 1. Generate PDF Buffer
        const pdfBuffer = await generateCertificatePDF(tc.cert)
        console.log(`   └─ Buffer Generated: ${pdfBuffer.length} bytes`)

        // 2. Size Check (> 2KB = 2000 bytes)
        if (!pdfBuffer || pdfBuffer.length < 2000) {
            throw new Error(`FAIL: PDF Buffer size (${pdfBuffer.length} bytes) is below minimum expected threshold of 2,000 bytes!`)
        }
        console.log(`   └─ Size Check (>2KB): PASS (${pdfBuffer.length} bytes)`)

        // 3. Header Check (%PDF-)
        const pdfHeader = pdfBuffer.slice(0, 8).toString('utf-8')
        if (!pdfHeader.startsWith('%PDF-')) {
            throw new Error(`FAIL: Invalid PDF signature: ${pdfHeader}`)
        }
        console.log(`   └─ Header Signature: PASS (${pdfHeader.trim()})`)

        // 4. PDF Structure & Text Extraction via PDFParse
        const parser = new PDFParse({ data: pdfBuffer })
        const parsed = await parser.getText()
        console.log(`   └─ Parsed Page Count: ${parsed.total}`)
        if (parsed.total !== 1) {
            throw new Error(`FAIL: Certificate PDF should be exactly 1 page, but has ${parsed.total} pages!`)
        }

        const textContent = parsed.text
        console.log(`   └─ Extracted Text Length: ${textContent.length} characters`)

        // 5. Text Presence Checks
        if (!textContent.includes('CERTIFICATE OF ACHIEVEMENT')) {
            throw new Error(`FAIL: PDF text missing heading "CERTIFICATE OF ACHIEVEMENT"! Text found:\n${textContent}`)
        }
        console.log(`   └─ Heading Text Check ("CERTIFICATE OF ACHIEVEMENT"): PASS`)

        if (!textContent.includes('EduValues')) {
            throw new Error(`FAIL: PDF text missing brand name "EduValues"!`)
        }
        console.log(`   └─ Brand Name Check ("EduValues"): PASS`)

        if (!textContent.includes(tc.cert.studentName)) {
            throw new Error(`FAIL: PDF text missing student name "${tc.cert.studentName}"! Text found:\n${textContent}`)
        }
        console.log(`   └─ Student Name Check ("${tc.cert.studentName}"): PASS`)

        if (!textContent.includes(tc.cert.courses.title)) {
            throw new Error(`FAIL: PDF text missing course title "${tc.cert.courses.title}"!`)
        }
        console.log(`   └─ Course Title Check ("${tc.cert.courses.title}"): PASS`)

        if (!textContent.includes(tc.cert.unique_code)) {
            throw new Error(`FAIL: PDF text missing verification code "${tc.cert.unique_code}"!`)
        }
        console.log(`   └─ Verification Code Check ("${tc.cert.unique_code}"): PASS`)

        console.log(`   ✅ RESULT: PASS\n`)
    }

    console.log('[TEST 5] Testing Email Attachment Buffer Handoff...')
    const sampleCert = testCases[0].cert
    const pdfBuffer = await generateCertificatePDF(sampleCert)
    const emailResult = await emailAutomation.sendCertificateAttachment(
        'eduvalues123@gmail.com',
        sampleCert.studentName,
        pdfBuffer,
        sampleCert.unique_code
    )

    console.log('   └─ Email SMTP Dispatch Result:', emailResult)
    if (!emailResult.success) {
        throw new Error(`FAIL: Email attachment dispatch failed: ${emailResult.error}`)
    }
    console.log('   ✅ RESULT: PASS (Email Attachment & SMTP Handoff Verified)\n')

    console.log('====================================================')
    console.log('  ALL AUTOMATED CERTIFICATE AUDITS PASSED 100%!      ')
    console.log('====================================================')
}

runCertificateVerificationSuite().catch(err => {
    console.error('\n❌ CERTIFICATE AUDIT SUITE FAILED:', err.message)
    process.exit(1)
})
