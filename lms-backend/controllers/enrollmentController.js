const supabase = require('../supabaseClient')
const { emailAutomation } = require('../utils/emailService')

// GET /api/enrollments/my
exports.getMyEnrollments = async (req, res) => {
    try {
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, course:course_id(*, lessons(*))')
            .eq('student_id', req.user.id)
        
        if (error) throw error
        
        const mappedEnrollments = (enrollments || []).map(e => {
            const lessons = e.course?.lessons || []
            if (lessons.length > 0) {
                lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
            }
            return {
                ...e,
                isCompleted: e.status === 'completed' || e.progress >= 100
            }
        })
        
        res.json({ enrollments: mappedEnrollments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/enrollments
exports.enroll = async (req, res) => {
    try {
        const { courseId, paymentId } = req.body
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .upsert({ 
                student_id: req.user.id, 
                course_id: courseId,
                status: 'active'
            }, { onConflict: 'student_id,course_id' })
            .select()
            .single()

        if (error) throw error

        // Fetch course details in background to send confirmation email
        supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single()
            .then(({ data: course }) => {
                const courseName = course ? course.title : 'New Course Adventure';
                return emailAutomation.sendEnrollmentConfirmation(
                    req.user.email,
                    req.user.name || req.user.email,
                    courseName
                );
            })
            .catch(err => {
                console.error('Failed to trigger enrollment email automation:', err.message);
            });

        res.status(201).json({ enrollment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/enrollments/:courseId/status
exports.checkEnrollment = async (req, res) => {
    try {
        const { data: enrollment, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', req.user.id)
            .eq('course_id', req.params.courseId)
            .maybeSingle()

        if (error) throw error
        res.json({ enrolled: !!enrollment, enrollment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
