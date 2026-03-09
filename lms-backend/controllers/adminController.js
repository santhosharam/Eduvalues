const User = require('../models/User')
const Course = require('../models/Course')
const Payment = require('../models/Payment')
const Enrollment = require('../models/Enrollment')

// GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const [courses, students, payments] = await Promise.all([
            Course.countDocuments(),
            User.countDocuments({ role: 'student' }),
            Payment.find({ status: 'success' }),
        ])
        const revenue = payments.reduce((s, p) => s + p.amount, 0)
        res.json({ courses, students, payments: payments.length, revenue })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/students
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort('-createdAt')
        res.json({ students })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/admin/students/:id
exports.deleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        await Enrollment.deleteMany({ student: req.params.id })
        res.json({ message: 'Student deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
