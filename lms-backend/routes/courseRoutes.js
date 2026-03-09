const express = require('express')
const router = express.Router()
const { getCourses, getCourseBySlug, getCourseById, createCourse, updateCourse, deleteCourse, getCategories } = require('../controllers/courseController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/categories', getCategories)
router.get('/id/:id', getCourseById)
router.get('/', getCourses)
router.get('/:slug', getCourseBySlug)
router.post('/', protect, adminOnly, createCourse)
router.put('/:id', protect, adminOnly, updateCourse)
router.delete('/:id', protect, adminOnly, deleteCourse)

module.exports = router
