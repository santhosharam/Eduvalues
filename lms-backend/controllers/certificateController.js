const Certificate = require('../models/Certificate')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit')

// GET /api/certificates/my
exports.getMyCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ student: req.user._id })
            .populate('course', 'title thumbnail instructor')
            .populate('student', 'name email')
            .sort('-issuedAt')
        res.json({ certificates })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/certificates/verify/:code  (public)
exports.verifyCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findOne({ uniqueCode: req.params.code })
            .populate('student', 'name')
            .populate('course', 'title instructor')
        if (!cert) return res.status(404).json({ message: 'Certificate not found', valid: false })
        res.json({ valid: true, certificate: cert })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/certificates/download/:id  (protected — streams PDF)
exports.downloadCertificate = async (req, res) => {
    try {
        const cert = await Certificate.findById(req.params.id)
            .populate('student', 'name')
            .populate('course', 'title instructor')

        if (!cert) return res.status(404).json({ message: 'Certificate not found' })
        if (String(cert.student._id) !== String(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' })
        }

        // Generate PDF on the fly with PDFKit
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 })

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="certificate-${cert.uniqueCode}.pdf"`
        )
        doc.pipe(res)

        // ── Background ──────────────────────────────────────────
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a')

        // ── Outer border ────────────────────────────────────────
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .lineWidth(3)
            .strokeColor('#6366f1')
            .stroke()

        // ── Inner border ────────────────────────────────────────
        doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
            .lineWidth(1)
            .strokeColor('#334155')
            .stroke()

        // ── Header badge ────────────────────────────────────────
        doc.fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#818cf8')
            .text('CERTIFICATE OF COMPLETION', 0, 55, { align: 'center' })

        // ── Main title ──────────────────────────────────────────
        doc.fontSize(42)
            .font('Helvetica-Bold')
            .fillColor('#f1f5f9')
            .text('LearnHub', 0, 80, { align: 'center' })

        // ── Divider ─────────────────────────────────────────────
        const midY = 140
        doc.moveTo(80, midY).lineTo(doc.page.width - 80, midY)
            .lineWidth(1).strokeColor('#334155').stroke()

        // ── Body text ───────────────────────────────────────────
        doc.fontSize(14)
            .font('Helvetica')
            .fillColor('#94a3b8')
            .text('This certifies that', 0, 160, { align: 'center' })

        doc.fontSize(32)
            .font('Helvetica-Bold')
            .fillColor('#6366f1')
            .text(cert.student.name, 0, 185, { align: 'center' })

        doc.fontSize(14)
            .font('Helvetica')
            .fillColor('#94a3b8')
            .text('has successfully completed the course', 0, 230, { align: 'center' })

        doc.fontSize(22)
            .font('Helvetica-Bold')
            .fillColor('#f1f5f9')
            .text(cert.course.title, 60, 255, { align: 'center', width: doc.page.width - 120 })

        // ── Instructor ──────────────────────────────────────────
        if (cert.course.instructor) {
            doc.fontSize(13)
                .font('Helvetica')
                .fillColor('#64748b')
                .text(`Instructor: ${cert.course.instructor}`, 0, 310, { align: 'center' })
        }

        // ── Divider ─────────────────────────────────────────────
        doc.moveTo(80, 340).lineTo(doc.page.width - 80, 340)
            .lineWidth(1).strokeColor('#334155').stroke()

        // ── Footer: date + code ─────────────────────────────────
        const issuedStr = new Date(cert.issuedAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#64748b')
            .text(`Issued on: ${issuedStr}`, 80, 360)
            .text(`Verification Code: ${cert.uniqueCode}`, { align: 'right' })

        doc.fontSize(11)
            .fillColor('#334155')
            .text('Verify at: http://localhost:5173/verify/' + cert.uniqueCode, 0, 390, { align: 'center' })

        doc.end()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
