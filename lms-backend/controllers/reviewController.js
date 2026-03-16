const Review = require('../models/Review')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')

exports.submitReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body
        const studentId = req.user._id

        // Verify enrollment
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId })
        if (!enrollment) return res.status(403).json({ message: 'You must be enrolled to review this course' })

        const review = await Review.create({
            course: courseId,
            student: studentId,
            rating,
            comment
        })

        // Update course rating (simple average)
        const reviews = await Review.find({ course: courseId })
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length

        await Course.findByIdAndUpdate(courseId, {
            $push: { reviews: review._id },
            rating: avgRating.toFixed(1)
        })

        res.status(201).json({ review })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
