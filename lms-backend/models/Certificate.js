const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    certificateUrl: { type: String },
    uniqueCode: { type: String, unique: true },
    issuedAt: { type: Date, default: Date.now },
}, { timestamps: true })

certificateSchema.index({ student: 1, courseId: 1 })

module.exports = mongoose.model('Certificate', certificateSchema)
