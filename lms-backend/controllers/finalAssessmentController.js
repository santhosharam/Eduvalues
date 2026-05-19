const supabase = require('../supabaseClient')
const crypto = require('crypto')

// GET /api/assessments/:courseId
exports.getAssessment = async (req, res) => {
    try {
        const { data: assessment, error } = await supabase
            .from('final_assessments')
            .select('*')
            .eq('course_id', req.params.courseId)
            .single()

        if (error || !assessment) return res.status(404).json({ message: 'Assessment not found' })
        
        // Don't send the correct answer keys to the frontend!
        const cleanQuestions = assessment.questions.map(q => {
            const { correctAnswer, ...rest } = q
            return rest
        })

        res.json({ questions: cleanQuestions })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/assessments/:courseId/submit
exports.submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body
        const { data: assessment, error } = await supabase
            .from('final_assessments')
            .select('*')
            .eq('course_id', req.params.courseId)
            .single()

        if (error || !assessment) return res.status(404).json({ message: 'Assessment not found' })

        let score = 0
        const results = assessment.questions.map((q, idx) => {
            const isCorrect = q.correctAnswer === answers[idx]
            if (isCorrect) score++
            return { question: q.question, isCorrect }
        })

        const percent = (score / assessment.questions.length) * 100
        const passed = percent >= assessment.passing_score

        if (passed) {
            // Generate Certificate
            const uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase()
            await supabase
                .from('certificates')
                .upsert({
                    student_id: req.user.id,
                    course_id: req.params.courseId,
                    unique_code: uniqueCode
                }, { onConflict: 'student_id,course_id' })
        }

        res.json({ score, percent, passed, results })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
