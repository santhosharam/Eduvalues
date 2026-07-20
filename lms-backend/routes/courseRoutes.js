const express = require('express')
const router = express.Router()
const { getCourses, getCourseBySlug, getCourseById, createCourse, updateCourse, deleteCourse, getCategories, submitFinalExam, getFinalExam } = require('../controllers/courseController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/categories', getCategories)
router.get('/id/:id', getCourseById)
router.get('/:id/final-exam', protect, getFinalExam)
router.get('/', getCourses)
router.get('/:slug', getCourseBySlug)
router.post('/', protect, adminOnly, createCourse)
router.put('/:id', protect, adminOnly, updateCourse)
router.post('/:id/submit-final-exam', protect, submitFinalExam)
router.delete('/:id', protect, adminOnly, deleteCourse)

module.exports = router
