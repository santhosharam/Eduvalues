const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    content: { type: String },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    resources: [{ name: String, url: String }],
}, { timestamps: true })

module.exports = mongoose.model('Lesson', lessonSchema)
