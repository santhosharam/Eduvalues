import { supabase } from './supabaseClient'

export const getAllCourses = async (params = {}) => {
    let query = supabase.from('courses').select('*')

    if (params.search) {
        query = query.ilike('title', `%${params.search}%`)
    }
    if (params.level) {
        query = query.eq('level', params.level)
    }
    if (params.category) {
        query = query.eq('category', params.category)
    }

    const { data, error } = await query
    if (error) throw error
    
    // Mimic the axios response structure { data: { courses: [...] } }
    return { data: { courses: data || [] } }
}

export const getCourseBySlug = async (slug) => {
    // 1. Get the course
    const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`) // Attempt both slug and id
        .single()
    
    if (error) throw error

    // 2. Get the lessons for this course
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('order', { ascending: true })

    return { data: { course: { ...course, lessons: lessons || [] } } }
}

export const getCategories = async () => {
    const { data, error } = await supabase
        .from('courses')
        .select('category')
    
    if (error) throw error
    const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))]
    return { data: uniqueCategories }
}

export const createCourse = async (data) => {
    const { data: result, error } = await supabase
        .from('courses')
        .insert([data])
        .select()
        .single()
    
    if (error) throw error
    return { data: result }
}

export const updateCourse = async (id, data) => {
    const { data: result, error } = await supabase
        .from('courses')
        .update(data)
        .eq('id', id)
        .select()
        .single()
    
    if (error) throw error
    return { data: result }
}

export const deleteCourse = async (id) => {
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
    
    if (error) throw error
    return { data: { success: true } }
}
