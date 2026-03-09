const express = require('express')
const router = express.Router()
const { getCourseProgress, markLessonComplete } = require('../controllers/progressController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:courseId', protect, getCourseProgress)
router.post('/:courseId/lesson/:lessonId', protect, markLessonComplete)

module.exports = router
