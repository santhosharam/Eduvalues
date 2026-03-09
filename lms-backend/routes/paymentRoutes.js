const express = require('express')
const router = express.Router()
const { initiatePayment, verifyPayment, getMyPayments, getAllPayments } = require('../controllers/paymentController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/initiate', protect, initiatePayment)
router.post('/verify', protect, verifyPayment)
router.get('/history', protect, getMyPayments)
router.get('/all', protect, adminOnly, getAllPayments)

module.exports = router
