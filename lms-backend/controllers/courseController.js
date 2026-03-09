const Course = require('../models/Course')

// GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        const { category, level, limit, all } = req.query
        const filter = {}
        if (!all) filter.isPublished = true
        if (category) filter.category = category
        if (level) filter.level = level
        const query = Course.find(filter).populate('lessons', 'title duration isFree').sort('-createdAt')
        if (limit) query.limit(parseInt(limit))
        const courses = await query
        res.json({ courses })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/:slug
exports.getCourseBySlug = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate('lessons')
        if (!course) return res.status(404).json({ message: 'Course not found' })
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/id/:id
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('lessons')
        if (!course) return res.status(404).json({ message: 'Course not found' })
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/courses (admin)
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body)
        res.status(201).json({ course })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// PUT /api/courses/:id (admin)
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!course) return res.status(404).json({ message: 'Course not found' })
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/courses/:id (admin)
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id)
        res.json({ message: 'Course deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Course.distinct('category')
        res.json({ categories })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
