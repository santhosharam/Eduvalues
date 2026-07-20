const supabase = require('../supabaseClient')
const PDFDocument = require('pdfkit')
const { emailAutomation } = require('../utils/emailService')

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

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="certificate-${cert.unique_code}.pdf"`)
        doc.pipe(res)

        // Certificate Design Logic
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a')
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor('#6366f1').stroke()
        
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#818cf8').text('CERTIFICATE OF COMPLETION', 0, 55, { align: 'center' })
        doc.fontSize(42).font('Helvetica-Bold').fillColor('#f1f5f9').text('EduValues', 0, 80, { align: 'center' })

        doc.fontSize(14).font('Helvetica').fillColor('#94a3b8').text('This certifies that', 0, 160, { align: 'center' })
        doc.fontSize(32).font('Helvetica-Bold').fillColor('#6366f1').text(studentName, 0, 185, { align: 'center' })
        doc.fontSize(14).font('Helvetica').fillColor('#94a3b8').text('has successfully completed the course', 0, 230, { align: 'center' })
        doc.fontSize(22).font('Helvetica-Bold').fillColor('#f1f5f9').text(cert.courses.title, 60, 255, { align: 'center', width: doc.page.width - 120 })

        const issuedStr = new Date(cert.issued_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        doc.fontSize(12).font('Helvetica').fillColor('#64748b').text(`Issued on: ${issuedStr}`, 80, 360).text(`Verification Code: ${cert.unique_code}`, { align: 'right' })

        doc.end()
    } catch (err) {
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
