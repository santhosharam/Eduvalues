const express = require('express')
const router = express.Router()
const { getMyEnrollments, enroll, checkEnrollment } = require('../controllers/enrollmentController')
const { protect } = require('../middleware/authMiddleware')

router.get('/my', protect, getMyEnrollments)
router.post('/', protect, enroll)
router.get('/:courseId/status', protect, checkEnrollment)

module.exports = router
