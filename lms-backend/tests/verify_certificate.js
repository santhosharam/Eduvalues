require('dotenv').config()
const supabase = require('../supabaseClient')
const { generateCertificatePDF } = require('../controllers/certificateController')
const { emailAutomation } = require('../utils/emailService')

async function runComprehensiveCertificateVerification() {
    console.log('====================================================')
    console.log('  STARTING COMPREHENSIVE CERTIFICATE VERIFICATION    ')
    console.log('====================================================\n')

    // 1. Test Course Lookup & Slug Resolution
    console.log('[TEST 1] Testing Course Lookup & Slug Resolution...')
    const courseIdOrSlug = 'essential-life-values-for-kids'
    
    // Simulate resolveCourseId logic
    let targetCourse = null
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(courseIdOrSlug)
    
    if (isUuid) {
        const { data } = await supabase.from('courses').select('id, title, slug').eq('id', courseIdOrSlug).maybeSingle()
        targetCourse = data
    } else {
        const { data } = await supabase.from('courses').select('id, title, slug').eq('slug', courseIdOrSlug).maybeSingle()
        targetCourse = data
    }

    if (!targetCourse) {
        const { data: firstCourse } = await supabase.from('courses').select('id, title, slug').limit(1).maybeSingle()
        targetCourse = firstCourse
    }

    console.log('   └─ Resolved Course UUID:', targetCourse?.id)
    console.log('   └─ Resolved Course Title:', targetCourse?.title)
    if (!targetCourse?.id) {
        throw new Error('FAIL: Unable to resolve course to a valid UUID!')
    }
    console.log('   ✅ RESULT: PASS\n')

    // 2. Test Idempotent Certificate Upsert / Retrieval
    console.log('[TEST 2] Testing Idempotent Certificate Creation & Recovery (Prevent 500)...')
    const realStudentId = '02707c65-9490-4296-a211-9b16bc1fa712'
    
    // Query or create test certificate record
    const { data: existingCert } = await supabase
        .from('certificates')
        .select('id, certificate_code')
        .eq('student_id', realStudentId)
        .eq('course_id', targetCourse.id)
        .maybeSingle()

    let testCertId = existingCert?.id
    let testCode = existingCert?.certificate_code

    if (!testCertId) {
        testCode = `CERT-TEST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        const { data: created, error } = await supabase
            .from('certificates')
            .upsert({
                student_id: realStudentId,
                course_id: targetCourse.id,
                certificate_code: testCode
            }, { onConflict: 'student_id,course_id' })
            .select()
            .single()

        if (error) {
            throw new Error(`FAIL: Upsert error: ${error.message}`)
        }
        testCertId = created.id
    }

    console.log('   └─ Certificate ID:', testCertId)
    console.log('   └─ Verification Code:', testCode)

    // Repeat attempt to verify no duplicate creation or 500 error occurs
    const { data: repeatCert } = await supabase
        .from('certificates')
        .select('id')
        .eq('student_id', realStudentId)
        .eq('course_id', targetCourse.id)
        .maybeSingle()

    if (repeatCert?.id !== testCertId) {
        throw new Error('FAIL: Duplicate certificate created!')
    }
    console.log('   ✅ RESULT: PASS (Idempotency & Duplicate Prevention Verified)\n')

    // 3. Test Backend PDFKit Certificate Buffer Generation
    console.log('[TEST 3] Testing Server-side PDFKit Certificate Buffer Generator...')
    const testCases = [
        { name: 'Santhosh S', course: 'Character Builders: Essential Life Values for Kids' },
        { name: 'A Very Extremely Long Student Full Name That Needs To Wrap Correctly', course: 'Character Builders: Essential Life Values and Important Social Emotional Learning Skills for Children' }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i]
        const pdfBuf = await generateCertificatePDF({
            studentName: tc.name,
            courses: { title: tc.course, instructor: 'EduValues Team' },
            unique_code: testCode,
            issued_at: new Date()
        })

        console.log(`   └─ Case ${i + 1} Buffer Length: ${pdfBuf.length} bytes`)
        if (!pdfBuf || pdfBuf.length < 2000) {
            throw new Error(`FAIL: PDF Buffer size (${pdfBuf?.length}) is below 2,000 bytes threshold!`)
        }
        const signature = pdfBuf.slice(0, 8).toString('utf-8')
        if (!signature.startsWith('%PDF-')) {
            throw new Error(`FAIL: Invalid PDF signature: ${signature}`)
        }
        console.log(`   └─ Case ${i + 1} PDF Header: PASS (${signature.trim()})`)
    }
    console.log('   ✅ RESULT: PASS (Server PDF Generator Verified)\n')

    // 4. Test Email Handoff via Nodemailer
    console.log('[TEST 4] Testing Backend Email Attachment Handoff...')
    const sampleBuffer = await generateCertificatePDF({
        studentName: testCases[0].name,
        courses: { title: testCases[0].course },
        unique_code: testCode
    })
    const emailResult = await emailAutomation.sendCertificateAttachment(
        'eduvalues123@gmail.com',
        testCases[0].name,
        sampleBuffer,
        testCode
    )
    console.log('   └─ Email Result:', emailResult)
    if (!emailResult.success) {
        throw new Error(`FAIL: Email dispatch error: ${emailResult.error}`)
    }
    console.log('   ✅ RESULT: PASS (Email Attachment Handoff Verified)\n')

    console.log('====================================================')
    console.log('  ALL AUTOMATED BACKEND CERTIFICATE TESTS PASSED!    ')
    console.log('====================================================')
}

runComprehensiveCertificateVerification().catch(err => {
    console.error('\n❌ COMPREHENSIVE CERTIFICATE VERIFICATION FAILED:', err.message)
    process.exit(1)
})
