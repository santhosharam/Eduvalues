const supabase = require('../supabaseClient')
const { v4: uuidv4 } = require('uuid')

// GET /api/progress/:courseId
exports.getCourseProgress = async (req, res) => {
    try {
        const { data: progress, error } = await supabase
            .from('enrollments')
            .select('completed_lessons, progress')
            .eq('student_id', req.user.id)
            .eq('course_id', req.params.courseId)
            .single()

        if (error || !progress) {
            return res.json({ progress: { completedLessons: [], percent: 0 } })
        }
        
        res.json({ progress: { completedLessons: progress.completed_lessons || [], percent: progress.progress || 0 } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/progress/:courseId/lesson/:lessonId
exports.markLessonComplete = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params
        const studentId = req.user.id

        // Fetch current enrollment
        const { data: enrollment, error: eErr } = await supabase
            .from('enrollments')
            .select('completed_lessons')
            .eq('student_id', studentId)
            .eq('course_id', courseId)
            .single()

        if (eErr || !enrollment) return res.status(404).json({ message: 'Enrollment not found' })

        let completed = enrollment.completed_lessons || []
        if (!completed.includes(lessonId)) {
            completed.push(lessonId)
        }

        // Calculate percent
        const { data: lessons } = await supabase
            .from('lessons')
            .select('id', { count: 'exact' })
            .eq('course_id', courseId)

        const total = lessons?.length || 1
        const percent = Math.round((completed.length / total) * 100)

        // Update enrollment
        const { error: uErr } = await supabase
            .from('enrollments')
            .update({ 
                completed_lessons: completed,
                progress: percent,
                last_watched_lesson_id: lessonId
            })
            .eq('student_id', studentId)
            .eq('course_id', courseId)

        if (uErr) throw uErr

        res.json({ percent, completedLessons: completed })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/progress/:courseId/final-assessment
exports.submitFinalAssessment = async (req, res) => {
    try {
        const { courseId } = req.params
        const { answers } = req.body 
        const studentId = req.user.id

        // Fetch course and assessment
        const { data: assessment, error: aErr } = await supabase
            .from('final_assessments')
            .select('*')
            .eq('course_id', courseId)
            .single()

        if (aErr || !assessment) return res.status(404).json({ message: 'Assessment not found' })

        // Check if all lessons are completed
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('completed_lessons')
            .eq('student_id', studentId)
            .eq('course_id', courseId)
            .single()

        const { data: lessons } = await supabase.from('lessons').select('id').eq('course_id', courseId)
        
        if (!enrollment || enrollment.completed_lessons.length < lessons.length) {
            return res.status(400).json({ message: 'Please complete all lessons first' })
        }

        // Calculate score
        let score = 0
        assessment.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) score++
        })

        const percent = (score / assessment.questions.length) * 100
        const passed = percent >= assessment.passing_score

        if (passed) {
            // Update enrollment
            await supabase
                .from('enrollments')
                .update({ is_completed: true, completed_at: new Date(), progress: 100 })
                .eq('student_id', studentId)
                .eq('course_id', courseId)

            // Generate certificate
            const uniqueCode = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            const { data: certificate } = await supabase
                .from('certificates')
                .upsert({
                    student_id: studentId,
                    course_id: courseId,
                    unique_code: uniqueCode
                }, { onConflict: 'student_id,course_id' })
                .select()
                .single()

            res.json({ success: true, score, percent, passed: true, certificateId: certificate?.id })
        } else {
            res.json({ success: false, score, percent, passed: false, message: 'You did not pass. Try again!' })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
