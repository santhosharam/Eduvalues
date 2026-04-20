const Enrollment = require('../models/Enrollment')
const Lesson = require('../models/Lesson')
const Progress = require('../models/Progress')
const Course = require('../models/Course')

exports.checkLessonAccess = async (req, res, next) => {
    try {
        const lesson = await Lesson.findById(req.params.id || req.params.lessonId)
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' })

        if (lesson.isFree) return next()

        const enrolled = await Enrollment.findOne({ student: req.user._id, courseId: lesson.courseId })
        if (!enrolled && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Please enroll in the course to access this lesson' })
        }

        // Sequential Progress Check
        const course = await Course.findById(lesson.courseId).populate('lessons')
        const progress = await Progress.findOne({ student: req.user._id, courseId: lesson.courseId })
        const completedIds = progress ? progress.completedLessons.map(id => id.toString()) : []
        
        // Find index of current lesson in course lessons
        const lessonIndex = course.lessons.findIndex(l => l._id.toString() === lesson._id.toString())
        
        if (lessonIndex > 0 && req.user.role !== 'admin') {
            const previousLessonId = course.lessons[lessonIndex - 1]._id.toString()
            if (!completedIds.includes(previousLessonId)) {
                return res.status(403).json({ message: 'Please complete the previous topic first!', sequentialError: true })
            }
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
