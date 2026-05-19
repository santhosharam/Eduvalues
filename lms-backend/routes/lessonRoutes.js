const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET /api/lessons/course/:courseId
router.get('/course/:courseId', protect, async (req, res) => {
    try {
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', req.params.courseId)
            .order('order_index', { ascending: true })
        
        if (error) throw error
        res.json({ lessons })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/lessons/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const { data: lesson, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', req.params.id)
            .single()

        if (error || !lesson) return res.status(404).json({ message: 'Lesson not found' })
        res.json({ lesson })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST /api/lessons (admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { data: lesson, error } = await supabase
            .from('lessons')
            .insert({
                course_id: req.body.course_id || req.body.courseId,
                title: req.body.title,
                content: req.body.content,
                order_index: req.body.order_index || req.body.order,
                video_url: req.body.video_url,
                story: req.body.story,
                learning_goals: req.body.learning_goals,
                parent_tip: req.body.parent_tip,
                qa_items: req.body.qa_items,
                todo_list: req.body.todo_list,
                reading_time: req.body.reading_time,
                quick_summary: req.body.quick_summary,
                moral_value: req.body.moral_value,
                is_free: req.body.isFree || req.body.is_free || false
            })
            .select()
            .single()

        if (error) throw error
        res.status(201).json({ lesson })
    } catch (err) { 
        console.error('[CREATE_LESSON_ERROR]', err.message)
        res.status(400).json({ message: err.message }) 
    }
})

// PUT /api/lessons/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { data: lesson, error } = await supabase
            .from('lessons')
            .update({
                title: req.body.title,
                content: req.body.content,
                order_index: req.body.order_index || req.body.order,
                video_url: req.body.video_url,
                story: req.body.story,
                learning_goals: req.body.learning_goals,
                parent_tip: req.body.parent_tip,
                qa_items: req.body.qa_items,
                todo_list: req.body.todo_list,
                reading_time: req.body.reading_time,
                quick_summary: req.body.quick_summary,
                moral_value: req.body.moral_value,
                is_free: req.body.isFree || req.body.is_free
            })
            .eq('id', req.params.id)
            .select()
            .single()

        if (error) throw error
        res.json({ lesson })
    } catch (err) { 
        console.error('[UPDATE_LESSON_ERROR]', err.message)
        res.status(500).json({ message: err.message }) 
    }
})

// DELETE /api/lessons/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', req.params.id)

        if (error) throw error
        res.json({ message: 'Lesson deleted' })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
