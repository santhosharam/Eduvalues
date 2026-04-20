const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, default: 'razorpay' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    transactionId: { type: String },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    paidAt: { type: Date },
}, { timestamps: true })

paymentSchema.index({ razorpayOrderId: 1 }, { unique: true })
paymentSchema.index({ student: 1, courseId: 1 })

module.exports = mongoose.model('Payment', paymentSchema)
