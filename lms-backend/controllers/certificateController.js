const supabase = require('../supabaseClient')
const PDFDocument = require('pdfkit')
const { emailAutomation } = require('../utils/emailService')

// Helper function to draw the certificate on a PDFDocument
const generateCertificatePDF = (doc, cert, studentName) => {
    // Certificate Design Logic
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
    const courseTitle = cert?.courses?.title || cert?.title || 'Character Builders: Essential Life Values for Kids';
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#f1f5f9').text(courseTitle, 60, currentY, { align: 'center', width: doc.page.width - 120 })

    // Ensure bottom footer is pushed down properly but doesn't overflow page
    const footerY = Math.max(doc.y + 35, 480);
    const issuedStr = new Date(cert?.issued_at || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    
    // Print issued date on the left and verification code on the right
    doc.fontSize(12).font('Helvetica').fillColor('#64748b')
       .text(`Issued on: ${issuedStr}`, 80, footerY)
       .text(`Verification Code: ${cert?.unique_code || 'CERT-VERIFIED'}`, 80, footerY, { align: 'right', width: doc.page.width - 160 })
}

// GET /api/certificates/my
exports.getMyCertificates = async (req, res) => {
    try {
        const { data: certificates, error } = await supabase
            .from('certificates')
            .select('*, courses(title, thumbnail, instructor)')
            .eq('student_id', req.user.id)
            .order('issued_at', { ascending: false })
        
        if (error) throw error
        res.json({ certificates })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/certificates/verify/:code (public)
exports.verifyCertificate = async (req, res) => {
    try {
        const { data: cert, error } = await supabase
            .from('certificates')
            .select('*, courses(title, instructor)')
            .eq('unique_code', req.params.code)
            .single()

        if (error || !cert) return res.status(404).json({ message: 'Certificate not found', valid: false })
        
        // Fetch student name from Auth (needs service role)
        const { data: { user }, error: uErr } = await supabase.auth.admin.getUserById(cert.student_id)
        
        res.json({ 
            valid: true, 
            certificate: {
                ...cert,
                student_name: user?.user_metadata?.full_name || 'Student'
            } 
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/certificates/download/:id
exports.downloadCertificate = async (req, res) => {
    try {
        const { data: cert, error } = await supabase
            .from('certificates')
            .select('*, courses(title, instructor)')
            .eq('id', req.params.id)
            .single()

        if (error || !cert) return res.status(404).json({ message: 'Certificate not found' })
        
        if (cert.student_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const { data: { user } } = await supabase.auth.admin.getUserById(cert.student_id)
        const studentName = user?.user_metadata?.full_name || 'Student'

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 })

        const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_')
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="Certificate_${sanitizedName}.pdf"`)
        doc.pipe(res)

        generateCertificatePDF(doc, cert, studentName)

        doc.end()
    } catch (err) {
        console.error('[DOWNLOAD_CERTIFICATE_ERROR]', err)
        res.status(500).json({ message: err.message })
    }
}

// POST /api/certificates/complete
exports.completeCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const studentId = req.user.id

        if (!courseId) return res.status(400).json({ message: 'courseId is required' })

        // 1. Get Course Slug and Title
        const { data: course, error: cErr } = await supabase
            .from('courses')
            .select('title, slug')
            .eq('id', courseId)
            .single()

        if (cErr || !course) return res.status(404).json({ message: 'Course not found' })

        // 2. Generate a unique code
        const uniqueCode = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

        // 3. Upsert certificate record
        const { data: certificate, error: certErr } = await supabase
            .from('certificates')
            .upsert({
                student_id: studentId,
                course_id: courseId,
                unique_code: uniqueCode
            }, { onConflict: 'student_id,course_id' })
            .select()
            .single()

        if (certErr) throw certErr

        // 4. Update enrollment status & progress
        await supabase
            .from('enrollments')
            .update({ 
                status: 'completed',
                progress: 100 
            })
            .eq('student_id', studentId)
            .eq('course_id', courseId)

        // 5. Trigger the Email Automation in the background
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        const verificationLink = `${clientUrl}/verify/${uniqueCode}`
        
        emailAutomation.sendCourseCompletion(
            req.user.email,
            req.user.name || req.user.email,
            course.title,
            verificationLink
        ).catch(err => {
            console.error('Failed to trigger certificate completion email:', err.message)
        })

        res.json({ 
            success: true, 
            certificateId: certificate.id, 
            uniqueCode 
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/certificates/email/:id
exports.emailCertificate = async (req, res) => {
    try {
        const { data: cert, error } = await supabase
            .from('certificates')
            .select('*, courses(title, instructor)')
            .eq('id', req.params.id)
            .single()

        if (error || !cert) return res.status(404).json({ message: 'Certificate not found' })
        
        if (cert.student_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }

        const { data: { user } } = await supabase.auth.admin.getUserById(cert.student_id)
        const studentName = user?.user_metadata?.full_name || 'Student'
        const studentEmail = user?.email || req.user.email

        if (!studentEmail) {
            return res.status(400).json({ message: 'User does not have an associated email' })
        }

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 })
        const chunks = []
        
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks)
            const emailResult = await emailAutomation.sendCertificateAttachment(studentEmail, studentName, pdfBuffer, cert.unique_code)
            
            if (emailResult.success) {
                res.json({ success: true, message: 'Certificate sent successfully to your registered email.' })
            } else {
                res.status(500).json({ success: false, message: 'Unable to send certificate. Please try again.' })
            }
        })

        generateCertificatePDF(doc, cert, studentName)
        doc.end()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
