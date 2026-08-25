const supabase = require('../supabaseClient')
const PDFDocument = require('pdfkit')
const { emailAutomation } = require('../utils/emailService')

// Authoritative helper function to generate a complete A4 landscape certificate PDF Buffer
const generateCertificatePDF = (cert) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 })
            const chunks = []

            doc.on('data', chunk => chunks.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(chunks)))
            doc.on('error', reject)

            const width = doc.page.width
            const height = doc.page.height
            const studentName = cert.studentName || cert.student_name || 'Student'
            const courseTitle = cert.courses?.title || cert.course_title || cert.title || 'Character Builders: Essential Life Values for Kids'
            const instructor = cert.courses?.instructor || cert.instructor || 'EduValues Academy'
            const uniqueCode = cert.unique_code || cert.code || 'CERT-VERIFIED'
            const issuedAt = cert.issued_at ? new Date(cert.issued_at) : new Date()
            const issuedStr = issuedAt.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

            // Dark Navy Background
            doc.rect(0, 0, width, height).fill('#0f172a')

            // Inner Accent Borders
            doc.rect(20, 20, width - 40, height - 40).lineWidth(4).strokeColor('#6366f1').stroke()
            doc.rect(28, 28, width - 56, height - 56).lineWidth(1.5).strokeColor('#818cf8').stroke()

            // Corner Accents
            const cornerSize = 25
            doc.rect(20, 20, cornerSize, cornerSize).fill('#6366f1')
            doc.rect(width - 20 - cornerSize, 20, cornerSize, cornerSize).fill('#6366f1')
            doc.rect(20, height - 20 - cornerSize, cornerSize, cornerSize).fill('#6366f1')
            doc.rect(width - 20 - cornerSize, height - 20 - cornerSize, cornerSize, cornerSize).fill('#6366f1')

            // Header - Brand Title
            doc.fontSize(38).font('Helvetica-Bold').fillColor('#ffffff').text('EduValues', 0, 50, { align: 'center' })
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#818cf8').text('CHARACTER & VALUE EDUCATION ACADEMY', 0, 95, { align: 'center' })

            // Divider Line
            doc.moveTo(width / 2 - 120, 115).lineTo(width / 2 + 120, 115).lineWidth(2).strokeColor('#6366f1').stroke()

            // Certificate Title
            doc.fontSize(22).font('Helvetica-Bold').fillColor('#1DD1A1').text('CERTIFICATE OF ACHIEVEMENT', 0, 130, { align: 'center' })

            // Subtitle Text
            doc.fontSize(13).font('Helvetica').fillColor('#94a3b8').text('This certifies that', 0, 170, { align: 'center' })

            // Student Name (Dynamic font sizing to handle long names cleanly)
            let nameFontSize = 32
            if (studentName.length > 40) nameFontSize = 20
            else if (studentName.length > 25) nameFontSize = 24
            
            doc.fontSize(nameFontSize).font('Helvetica-Bold').fillColor('#6366f1').text(studentName, 60, 195, { align: 'center', width: width - 120 })

            let currentY = Math.max(doc.y + 10, 245)

            // Completion Text
            doc.fontSize(13).font('Helvetica').fillColor('#94a3b8').text('has successfully completed the course', 0, currentY, { align: 'center' })

            currentY = doc.y + 10

            // Course Title (Dynamic font sizing)
            let courseFontSize = 20
            if (courseTitle.length > 60) courseFontSize = 15
            else if (courseTitle.length > 40) courseFontSize = 17

            doc.fontSize(courseFontSize).font('Helvetica-Bold').fillColor('#ffffff').text(courseTitle, 60, currentY, { align: 'center', width: width - 120 })

            // Footer Section
            const footerY = 480

            // Left: Issued Date
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#94a3b8').text('DATE ISSUED', 80, footerY)
            doc.fontSize(12).font('Helvetica').fillColor('#ffffff').text(issuedStr, 80, footerY + 16)

            // Center: Instructor
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#94a3b8').text('INSTRUCTOR', width / 2 - 80, footerY, { align: 'center', width: 160 })
            doc.fontSize(12).font('Helvetica').fillColor('#ffffff').text(instructor, width / 2 - 100, footerY + 16, { align: 'center', width: 200 })

            // Right: Verification Code
            doc.fontSize(11).font('Helvetica-Bold').fillColor('#94a3b8').text('VERIFICATION CODE', width - 260, footerY, { align: 'right', width: 180 })
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#1DD1A1').text(uniqueCode, width - 260, footerY + 16, { align: 'right', width: 180 })

            // Seal Graphic
            doc.circle(width / 2, footerY - 25, 20).lineWidth(2).strokeColor('#FFD700').stroke()
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#FFD700').text('OFFICIAL', width / 2 - 25, footerY - 28, { align: 'center', width: 50 })
            doc.fontSize(7).font('Helvetica').fillColor('#FFD700').text('SEAL', width / 2 - 20, footerY - 18, { align: 'center', width: 40 })

            doc.end()
        } catch (err) {
            reject(err)
        }
    })
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

        const pdfBuffer = await generateCertificatePDF({
            ...cert,
            studentName
        })

        if (!pdfBuffer || pdfBuffer.length === 0) {
            return res.status(500).json({ message: 'Failed to generate certificate PDF' })
        }

        const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_')
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="Certificate_${sanitizedName}.pdf"`)
        res.setHeader('Content-Length', pdfBuffer.length)
        res.send(pdfBuffer)
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

        const pdfBuffer = await generateCertificatePDF({
            ...cert,
            studentName
        })

        if (!pdfBuffer || pdfBuffer.length === 0) {
            return res.status(500).json({ message: 'Failed to generate certificate PDF' })
        }

        const emailResult = await emailAutomation.sendCertificateAttachment(studentEmail, studentName, pdfBuffer, cert.unique_code)

        if (emailResult.success) {
            res.json({ success: true, message: 'Certificate sent successfully to your registered email.' })
        } else {
            res.status(500).json({ success: false, message: 'Unable to send certificate. Please try again.' })
        }
    } catch (err) {
        console.error('[EMAIL_CERTIFICATE_ERROR]', err)
        res.status(500).json({ message: err.message })
    }
}

// POST /api/certificates/email-image/:id
exports.emailCertificateImage = async (req, res) => {
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

        let imageBuffer
        if (req.file && req.file.buffer) {
            imageBuffer = req.file.buffer
        } else if (req.body && req.body.imageBuffer) {
            imageBuffer = Buffer.from(req.body.imageBuffer, 'base64')
        }

        if (!imageBuffer || imageBuffer.length < 1000) {
            return res.status(400).json({ message: 'Uploaded certificate image is invalid or empty' })
        }

        const emailResult = await emailAutomation.sendCertificateImageAttachment(
            studentEmail,
            studentName,
            imageBuffer,
            cert.unique_code || 'CERT-VERIFIED'
        )

        if (emailResult.success) {
            res.json({ success: true, message: 'Certificate image sent successfully to your registered email.' })
        } else {
            res.status(500).json({ success: false, message: 'Unable to send certificate image email. Please try again.' })
        }
    } catch (err) {
        console.error('[EMAIL_CERTIFICATE_IMAGE_ERROR]', err)
        res.status(500).json({ message: err.message })
    }
}

module.exports.generateCertificatePDF = generateCertificatePDF

