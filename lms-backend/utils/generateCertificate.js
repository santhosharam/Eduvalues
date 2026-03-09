const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a certificate PDF and returns the buffer
 * In a production app, you'd upload this to Cloudinary/S3.
 */
exports.generateCertificatePDF = (studentName, courseTitle, completionDate, uniqueCode) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
                margin: 0
            });

            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Background Color
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0f172a');

            // Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
                .lineWidth(2)
                .strokeColor('#6366f1')
                .stroke();

            // Content
            doc.fillColor('#f1f5f9')
                .fontSize(40)
                .text('CERTIFICATE OF COMPLETION', 0, 100, { align: 'center' });

            doc.fontSize(20)
                .text('This is to certify that', 0, 180, { align: 'center' });

            doc.fillColor('#818cf8')
                .fontSize(45)
                .text(studentName, 0, 230, { align: 'center' });

            doc.fillColor('#f1f5f9')
                .fontSize(20)
                .text('has successfully completed the course', 0, 310, { align: 'center' });

            doc.fontSize(30)
                .text(courseTitle, 0, 350, { align: 'center' });

            doc.fontSize(14)
                .fillColor('#94a3b8')
                .text(`Issued on: ${completionDate}`, 0, 450, { align: 'center' });

            doc.text(`Certificate ID: ${uniqueCode}`, 0, 470, { align: 'center' });

            // Signature line placeholder
            doc.moveTo(250, 530).lineTo(550, 530).strokeColor('#334155').stroke();
            doc.text('Authorized Signature', 0, 540, { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
