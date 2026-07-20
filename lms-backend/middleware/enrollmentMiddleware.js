const supabase = require('../supabaseClient')

exports.checkLessonAccess = async (req, res, next) => {
    try {
        const lessonId = req.params.id || req.params.lessonId
        
        // 1. Fetch Lesson from Supabase
        const { data: lesson, error: lErr } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', lessonId)
            .single()
            
        if (lErr || !lesson) return res.status(404).json({ message: 'Lesson not found' })

        // 2. Free lessons are always accessible
        if (lesson.is_free) return next()

        // 3. Check Enrollment in Supabase
        const { data: enrollment, error: eErr } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', req.user.id)
            .eq('course_id', lesson.course_id)
            .single()

        if ((eErr || !enrollment) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Please enroll in the course to access this lesson' })
        }

        // 4. Sequential Progress Check (Only for non-admins)
        if (req.user.role !== 'admin') {
            const { data: allLessons } = await supabase
                .from('lessons')
                .select('id, order_index')
                .eq('course_id', lesson.course_id)
                .order('order_index', { ascending: true })

            const lessonIndex = allLessons.findIndex(l => l.id === lesson.id)
            const completedIds = enrollment?.completed_lessons || []

            if (lessonIndex > 0) {
                const previousLessonId = allLessons[lessonIndex - 1].id
                if (!completedIds.includes(previousLessonId)) {
                    return res.status(403).json({ 
                        message: 'Please complete the previous topic first!', 
                        sequentialError: true 
                    })
                }
            }
        }

        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
