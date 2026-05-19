const supabase = require('../supabaseClient')

// GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        let query = supabase
            .from('courses')
            .select('*, lessons(*)')
        
        if (req.query.all !== 'true') {
            query = query.eq('is_published', true)
        }
            
        const { data: courses, error } = await query
        
        if (error) throw error

        // Sort lessons by order_index
        if (courses) {
            courses.forEach(c => {
                if (c.lessons && Array.isArray(c.lessons)) {
                    c.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                }
            })
        }

        res.json({ courses })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/:slug
exports.getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        
        const { data: course, error } = await supabase
            .from('courses')
            .select('*, lessons(*)')
            .eq('slug', slug)
            .single()

        if (error || !course) {
            return res.status(404).json({ message: 'Course not found' })
        }

        // Sort lessons by order_index
        if (course.lessons && Array.isArray(course.lessons)) {
            course.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        }
        
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/id/:id
exports.getCourseById = async (req, res) => {
    try {
        const identifier = req.params.id
        
        const { data: course, error } = await supabase
            .from('courses')
            .select('*, lessons(*)')
            .or(`id.eq.${identifier},slug.eq.${identifier}`)
            .single()

        if (error || !course) {
            console.log(`[DEBUG] Course not found in Supabase for: ${identifier}`)
            return res.status(404).json({ message: 'Course not found' })
        }

        // Sort lessons by order_index
        if (course.lessons && Array.isArray(course.lessons)) {
            course.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        }
        
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/courses (admin)
exports.createCourse = async (req, res) => {
    console.log('📬 [API] createCourse hit with body:', JSON.stringify(req.body, null, 2));
    try {
        const { 
            title, 
            description, 
            short_description, 
            instructor, 
            price, 
            discount_price,
            category, 
            level,
            duration,
            thumbnail, 
            is_published 
        } = req.body
        
        if (!title) throw new Error('Course title is required')
        
        const slug = title.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '')

        const { data: course, error } = await supabase
            .from('courses')
            .insert([{
                title,
                slug,
                description,
                short_description,
                instructor,
                price: Number(price) || 0,
                discount_price: discount_price ? Number(discount_price) : null,
                category,
                level: level || 'beginner',
                duration,
                thumbnail,
                is_published: is_published || false
            }])
            .select()
            .single()

        if (error) throw error
        console.log('✅ [DATABASE] Course created successfully:', course.id);
        res.status(201).json({ course })
    } catch (err) {
        console.error('[CREATE_COURSE_ERROR]', err.message)
        res.status(400).json({ message: err.message })
    }
}

// PUT /api/courses/:id (admin)
exports.updateCourse = async (req, res) => {
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single()

        if (error) throw error
        res.json({ course })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/courses/:id (admin)
exports.deleteCourse = async (req, res) => {
    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', req.params.id)

        if (error) throw error
        res.json({ message: 'Course deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/categories
exports.getCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('category')
        
        if (error) throw error
        const categories = [...new Set(data.map(item => item.category))]
        res.json({ categories })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/courses/:id/final-exam
exports.getFinalExam = async (req, res) => {
    try {
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', req.params.id)
            .order('order_index', { ascending: true })
        
        if (error || !lessons || lessons.length === 0) {
            return res.status(404).json({ message: 'No lessons found for this course' })
        }

        // Fetch 20 questions from the quizzes table where is_final_exam is true
        const { data: assessment, error: aErr } = await supabase
            .from('quizzes')
            .select('*')
            .eq('course_id', req.params.id)
            .eq('is_final_exam', true)
            .order('order_index', { ascending: true })

        if (aErr || !assessment || assessment.length === 0) {
             return res.status(404).json({ message: 'Final assessment not configured for this course' })
        }

        res.json({ questions: assessment })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// POST /api/courses/:id/submit-final-exam
exports.submitFinalExam = async (req, res) => {
    try {
        const { score, passed } = req.body // Usually calculated on backend, but let's follow the previous structure
        const courseId = req.params.id

        if (passed) {
            const uniqueCode = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            const { data: certificate, error } = await supabase
                .from('certificates')
                .upsert({
                    student_id: req.user.id,
                    course_id: courseId,
                    unique_code: uniqueCode
                }, { onConflict: 'student_id,course_id' })
                .select()
                .single()

            if (error) throw error
            return res.status(201).json({ message: 'Exam submitted successfully!', certificate })
        }

        res.json({ message: 'Exam submitted. You did not pass yet.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
