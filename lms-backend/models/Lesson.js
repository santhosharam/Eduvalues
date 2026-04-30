const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    content: { type: String },
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    resources: [{ name: String, url: String }],
    quiz: [{
        question: { type: String, required: true },
        options: [{
            text: { type: String, required: true },
            correct: { type: Boolean, default: false },
            feedback: { type: String }
        }]
    }],
    panels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Panel' }]
}, { timestamps: true })

lessonSchema.index({ courseId: 1 })

module.exports = mongoose.model('Lesson', lessonSchema)
