const express = require('express')
const router = express.Router()
const { getAssessment, submitAssessment } = require('../controllers/finalAssessmentController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:courseId', protect, getAssessment)
router.post('/:courseId/submit', protect, submitAssessment)

module.exports = router
