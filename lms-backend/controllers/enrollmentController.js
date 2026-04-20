const Enrollment = require('../models/Enrollment')

// GET /api/enrollments/my
exports.getMyEnrollments = async (req, res) => {
    try {
        const Enrollment = require('../models/Enrollment')
        const Progress = require('../models/Progress')
        
        let enrollments = await Enrollment.find({ student: req.user._id }).populate('courseId').lean()
        
        // Add progress info to lean objects
        for (let e of enrollments) {
            const p = await Progress.findOne({ student: req.user._id, courseId: e.courseId?._id || e.courseId })
            if (p) {
                e.lastWatched = p.lastWatched
                e.completedLessons = p.completedLessons
            }
        }
        
        res.json({ enrollments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/enrollments
exports.enroll = async (req, res) => {
    try {
        const { courseId, paymentId } = req.body
        const existing = await Enrollment.findOne({ student: req.user._id, courseId: courseId })
        if (existing) return res.status(409).json({ message: 'Already enrolled' })
        const enrollment = await Enrollment.create({ student: req.user._id, courseId: courseId, payment: paymentId })
        res.status(201).json({ enrollment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/enrollments/:courseId/status
exports.checkEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user._id, courseId: req.params.courseId })
        res.json({ enrolled: !!enrollment, enrollment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
