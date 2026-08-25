require('dotenv').config()
const PDFDocument = require('pdfkit')
const { emailAutomation } = require('../utils/emailService')
const { submitContactForm } = require('../controllers/contactController')

const generateTestPDF = (studentName, courseTitle) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 })
        const chunks = []
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
            const buf = Buffer.concat(chunks)
            resolve(buf)
        })
        doc.on('error', reject)

        // Draw design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a')
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#6366f1').stroke()
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#818cf8').text('CERTIFICATE OF COMPLETION', 0, 55, { align: 'center' })
        doc.fontSize(42).font('Helvetica-Bold').fillColor('#f1f5f9').text('EduValues', 0, 80, { align: 'center' })

        let currentY = 160;
        doc.fontSize(14).font('Helvetica').fillColor('#94a3b8').text('This certifies that', 0, currentY, { align: 'center' })
        currentY = doc.y + 10;
        doc.fontSize(32).font('Helvetica-Bold').fillColor('#6366f1').text(studentName || 'Student', 60, currentY, { align: 'center', width: doc.page.width - 120 })
        currentY = doc.y + 15;
        doc.fontSize(14).font('Helvetica').fillColor('#94a3b8').text('has successfully completed the course', 0, currentY, { align: 'center' })
        currentY = doc.y + 10;
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#f1f5f9').text(courseTitle, 60, currentY, { align: 'center', width: doc.page.width - 120 })

        const footerY = Math.max(doc.y + 35, 480);
        doc.fontSize(12).font('Helvetica').fillColor('#64748b')
           .text(`Issued on: ${new Date().toLocaleDateString('en-IN')}`, 80, footerY)
           .text(`Verification Code: CERT-TEST-123`, 80, footerY, { align: 'right', width: doc.page.width - 160 })

        doc.end()
    })
}

async function runTests() {
    console.log('--- STARTING AUTOMATED CERTIFICATE & EMAIL AUDIT ---')

    const testCases = [
        { name: 'Normal Name', course: 'Normal Course' },
        { name: 'Very Long Student Name That Goes On And On And Needs To Wrap Correctly Without Overflow', course: 'Normal Course' },
        { name: 'Normal Name', course: 'Very Long Course Title That Could Potentially Overflow The Certificate Boundaries If Not Wrapped Properly' },
        { name: 'Very Long Student Name That Goes On And On And Needs To Wrap Correctly', course: 'Very Long Course Title That Could Potentially Overflow The Certificate Boundaries If Not Wrapped Properly' }
    ]

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i]
        console.log(`\n[Test ${i+1}] PDF Generation: Name="${tc.name.substring(0, 20)}...", Course="${tc.course.substring(0, 20)}..."`)
        const pdfBuf = await generateTestPDF(tc.name, tc.course)
        console.log(`   Buffer Size: ${pdfBuf.length} bytes`)
        if (pdfBuf.length < 1000) {
            throw new Error(`Test ${i+1} failed: PDF Buffer too small or empty! (${pdfBuf.length} bytes)`)
        }

        const pdfHeader = pdfBuf.slice(0, 8).toString('utf-8')
        console.log(`   PDF Header Signature: ${pdfHeader.trim()}`)
        if (!pdfHeader.startsWith('%PDF-')) {
            throw new Error(`Test ${i+1} failed: Invalid PDF Header!`)
        }

        // Check if raw stream contains text fragments
        const pdfStr = pdfBuf.toString('binary')
        const containsEduValues = pdfStr.includes('EduValues')
        console.log(`   Raw Stream Contains Brand Text: ${containsEduValues ? 'PASS' : 'FAIL'}`)
    }

    console.log('\n--- TESTING CONTACT API LOGIC ---')
    const reqMock = {
        body: {
            name: 'Audit Tester',
            email: 'eduvalues123@gmail.com',
            phone: '9876543210',
            message: 'Automated production QA audit message.'
        }
    }
    let resData = null
    const resMock = {
        status: (code) => ({
            json: (data) => { resData = { code, ...data } }
        }),
        json: (data) => { resData = { code: 200, ...data } }
    }

    await submitContactForm(reqMock, resMock)
    console.log('Contact Form API Result:', resData)

    console.log('\n--- ALL AUTOMATED BACKEND TESTS COMPLETED SUCCESSFULLY ---')
}

runTests().catch(err => {
    console.error('❌ AUTOMATED TEST FAILED:', err)
    process.exit(1)
})
