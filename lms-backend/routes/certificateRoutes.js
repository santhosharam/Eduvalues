const express = require('express')
const router = express.Router()
const { getMyCertificates, verifyCertificate, downloadCertificate } = require('../controllers/certificateController')
const { protect } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyCertificates)
router.get('/verify/:code', verifyCertificate)       // public
router.get('/download/:id', protect, downloadCertificate) // streams PDF

module.exports = router
