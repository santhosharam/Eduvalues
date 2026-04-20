const mongoose = require('mongoose')

const progressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastWatched: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
}, { timestamps: true })

progressSchema.index({ student: 1, courseId: 1 }, { unique: true })

module.exports = mongoose.model('Progress', progressSchema)
