const express = require('express')
const router = express.Router()
const { getCourseProgress, markLessonComplete, submitFinalAssessment } = require('../controllers/progressController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:courseId', protect, getCourseProgress)
router.post('/:courseId/lesson/:lessonId', protect, markLessonComplete)
router.post('/:courseId/final-assessment', protect, submitFinalAssessment)

module.exports = router
