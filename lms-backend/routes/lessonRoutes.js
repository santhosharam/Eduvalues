const express = require('express')
const router = express.Router()
const Lesson = require('../models/Lesson')
const Course = require('../models/Course')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET /api/lessons/course/:courseId
router.get('/course/:courseId', protect, async (req, res) => {
    try {
        const lessons = await Lesson.find({ course: req.params.courseId }).sort('order')
        res.json({ lessons })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/lessons/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' })
        res.json({ lesson })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/lessons (admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body)
        await Course.findByIdAndUpdate(req.body.course, { $push: { lessons: lesson._id } })
        res.status(201).json({ lesson })
    } catch (err) { res.status(400).json({ message: err.message }) }
})

// PUT /api/lessons/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json({ lesson })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/lessons/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id)
        if (lesson) await Course.findByIdAndUpdate(lesson.course, { $pull: { lessons: lesson._id } })
        res.json({ message: 'Lesson deleted' })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
