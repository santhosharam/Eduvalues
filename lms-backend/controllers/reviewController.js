const supabase = require('../supabaseClient')

exports.submitReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body
        const studentId = req.user.id

        // Verify enrollment in Supabase
        const { data: enrollment, error: eErr } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', studentId)
            .eq('course_id', courseId)
            .single()

        if (eErr || !enrollment) return res.status(403).json({ message: 'You must be enrolled to review this course' })

        // Create review in Supabase
        const { data: review, error: rErr } = await supabase
            .from('reviews')
            .insert([{
                course_id: courseId,
                student_id: studentId,
                rating,
                comment
            }])
            .select()
            .single()

        if (rErr) throw rErr

        // Update course rating (simple average)
        const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('course_id', courseId)

        if (reviews && reviews.length > 0) {
            const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
            
            await supabase
                .from('courses')
                .update({ rating: parseFloat(avgRating.toFixed(1)) })
                .eq('id', courseId)
        }

        res.status(201).json({ review })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
