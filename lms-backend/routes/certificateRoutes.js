const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } })
const { getMyCertificates, verifyCertificate, downloadCertificate, completeCourse, emailCertificate, emailCertificateImage } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyCertificates)
router.get('/verify/:code', verifyCertificate)       // public
router.get('/download/:id', protect, downloadCertificate)
router.post('/complete', protect, completeCourse)
router.post('/email-image/:id', protect, upload.single('image'), emailCertificateImage)
router.post('/email/:id', protect, upload.single('image'), emailCertificateImage)

module.exports = router
