const Enrollment = require('../models/Enrollment')
const Lesson = require('../models/Lesson')

exports.checkLessonAccess = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id || req.params.lessonId)
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

        if (lesson.isFree) return next()

        const enrolled = await Enrollment.findOne({ student: req.user._id, course: lesson.course })
        if (!enrolled && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Please enroll in the course to access this lesson' })
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
