const express = require('express')
const router = express.Router()
const { getMyCertificates, verifyCertificate, downloadCertificate, completeCourse, emailCertificate } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyCertificates)
router.get('/verify/:code', verifyCertificate)       // public
router.get('/download/:id', protect, downloadCertificate) // streams PDF
router.post('/complete', protect, completeCourse)
router.post('/email/:id', protect, emailCertificate)

module.exports = router
