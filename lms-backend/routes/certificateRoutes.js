const express = require('express')
const router = express.Router()
const { getMyCertificates, verifyCertificate, downloadCertificate, completeCourse } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyCertificates)
router.get('/verify/:code', verifyCertificate)       // public
router.get('/download/:id', protect, downloadCertificate) // streams PDF
router.post('/complete', protect, completeCourse)

module.exports = router
