const Progress = require('../models/Progress')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const Certificate = require('../models/Certificate')
const { v4: uuidv4 } = require('uuid')

// GET /api/progress/:courseId
exports.getCourseProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ student: req.user._id, course: req.params.courseId })
        res.json({ progress: progress || { completedLessons: [], percent: 0 } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/progress/:courseId/lesson/:lessonId
exports.markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params
        const studentId = req.user._id

        let progress = await Progress.findOne({ student: studentId, course: courseId })
        if (!progress) {
            progress = new Progress({ student: studentId, course: courseId, completedLessons: [] })
        }
        if (!progress.completedLessons.map(String).includes(String(lessonId))) {
            progress.completedLessons.push(lessonId)
        }
        progress.lastWatched = lessonId
        await progress.save()

        const course = await Course.findById(courseId)
        const total = course.lessons.length
        const percent = total > 0 ? Math.round((progress.completedLessons.length / total) * 100) : 0

        // Auto-complete enrollment
        await Enrollment.findOneAndUpdate(
            { student: studentId, course: courseId },
            { progress: percent, ...(percent === 100 && { isCompleted: true, completedAt: new Date() }) }
        )

        // Auto-generate certificate on completion
        if (percent === 100) {
            const exists = await Certificate.findOne({ student: studentId, course: courseId })
            if (!exists) {
                await Certificate.create({
                    student: studentId,
                    course: courseId,
                    uniqueCode: uuidv4().slice(0, 12).toUpperCase(),
                    certificateUrl: '', // Cloudinary URL would go here
                    issuedAt: new Date(),
                })
            }
        }

        res.json({ percent, completedLessons: progress.completedLessons })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
