const Razorpay = require('razorpay')
const crypto = require('crypto')
const Payment = require('../models/Payment')
const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

// POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
    try {
        const { courseId } = req.body
        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json({ message: 'Course not found' })

        const amount = (course.discountPrice || course.price) * 100 // paise

        // Free course: auto-enroll
        if (amount === 0) {
            await Enrollment.findOneAndUpdate(
                { student: req.user._id, course: courseId },
                { student: req.user._id, course: courseId },
                { upsert: true, new: true }
            )
            return res.json({ free: true, message: 'Enrolled for free!' })
        }

        const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `rcpt_${Date.now()}` })
        const payment = await Payment.create({ student: req.user._id, course: courseId, amount: course.discountPrice || course.price, razorpayOrderId: order.id })
        res.json({ orderId: order.id, amount, paymentId: payment._id })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body
        const body = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex')
        if (expectedSig !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' })

        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: 'success', razorpayPaymentId: razorpay_payment_id, paidAt: new Date() },
            { new: true }
        )
        // Create enrollment
        await Enrollment.findOneAndUpdate(
            { student: req.user._id, course: courseId },
            { student: req.user._id, course: courseId, payment: payment._id },
            { upsert: true, new: true }
        )
        res.json({ message: 'Payment verified, enrolled successfully!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/payments/history
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ student: req.user._id }).populate('course', 'title thumbnail').sort('-createdAt')
        res.json({ payments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/payments/all (admin)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('student', 'name email').populate('course', 'title').sort('-createdAt')
        res.json({ payments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
