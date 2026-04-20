const Progress = require('../models/Progress')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const Certificate = require('../models/Certificate')
const { v4: uuidv4 } = require('uuid')

// GET /api/progress/:courseId
exports.getCourseProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({ student: req.user._id, courseId: req.params.courseId })
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

        let progress = await Progress.findOne({ student: studentId, courseId: courseId })
        if (!progress) {
            progress = new Progress({ student: studentId, courseId: courseId, completedLessons: [] })
        }
        if (!progress.completedLessons.map(String).includes(String(lessonId))) {
            progress.completedLessons.push(lessonId)
        }
        progress.lastWatched = lessonId
        await progress.save()

        const course = await Course.findById(courseId)
        const total = course.lessons.length
        const percent = total > 0 ? Math.round((progress.completedLessons.length / total) * 100) : 0

        // Auto-complete enrollment (REMOVED - now requires final assessment)
        await Enrollment.findOneAndUpdate(
            { student: studentId, courseId: courseId },
            { progress: percent }
        )

        res.json({ percent, completedLessons: progress.completedLessons })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/progress/:courseId/final-assessment
exports.submitFinalAssessment = async (req, res) => {
    try {
        const { courseId } = req.params
        const { answers } = req.body // Array of selected option indices
        const studentId = req.user._id

        const course = await Course.findById(courseId)
        if (!course) return res.status(404).json({ message: 'Course not found' })

        if (!course.finalQuiz || course.finalQuiz.length === 0) {
            return res.status(400).json({ message: 'Final assessment not available for this course' })
        }

        // Check if all lessons are completed first
        const progress = await Progress.findOne({ student: studentId, courseId: courseId })
        if (!progress || progress.completedLessons.length < course.lessons.length) {
            return res.status(400).json({ message: 'Please complete all lessons before taking the final assessment' })
        }

        // Calculate score
        let score = 0
        course.finalQuiz.forEach((q, idx) => {
            const correctIdx = q.options.findIndex(o => o.correct)
            if (answers[idx] === correctIdx) {
                score++
            }
        })

        const totalQuestions = course.finalQuiz.length
        const passPercentage = 70 // 70% to pass
        const userPercentage = (score / totalQuestions) * 100

        if (userPercentage >= passPercentage) {
            // Mark enrollment as completed
            await Enrollment.findOneAndUpdate(
                { student: studentId, courseId: courseId },
                { isCompleted: true, completedAt: new Date(), progress: 100 }
            )

            // Generate certificate
            const exists = await Certificate.findOne({ student: studentId, courseId: courseId })
            let certificateId = exists?._id
            if (!exists) {
                const newCert = await Certificate.create({
                    student: studentId,
                    courseId: courseId,
                    uniqueCode: uuidv4().slice(0, 12).toUpperCase(),
                    certificateUrl: '', // In production, upload buffer from generateCertificatePDF
                    issuedAt: new Date(),
                })
                certificateId = newCert._id
            }

            // Mock Email Notification
            console.log(`Email sent to ${req.user.email}: Congratulations on passing the final assessment!`)

            res.json({ 
                success: true, 
                score, 
                totalQuestions, 
                percentage: userPercentage,
                message: 'Congratulations! You passed the final assessment.',
                certificateId
            })
        } else {
            res.json({ 
                success: false, 
                score, 
                totalQuestions, 
                percentage: userPercentage,
                message: 'You did not pass the final assessment. Please try again.' 
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
