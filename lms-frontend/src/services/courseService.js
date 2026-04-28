import { supabase } from './supabaseClient'

export const getAllCourses = async (params = {}) => {
    let query = supabase.from('courses').select('*')
    
    if (params.category) query = query.eq('category', params.category)
    if (params.level) query = query.eq('level', params.level)
    if (params.limit) query = query.limit(params.limit)
    if (params.search) query = query.ilike('title', `%${params.search}%`)

    const { data, error } = await query
    if (error) throw error
    return { data: { courses: data } }
}

export const getCourseBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*, lessons(*)')
        .eq('slug', slug)
        .single()
    
    if (error) throw error
    // Re-ordering lessons by order_index
    if (data.lessons) {
        data.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    }
    return { data: { course: data } }
}

export const getCourseById = async (id) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*, lessons(*)')
        .eq('id', id)
        .single()
    
    if (error) throw error
    return { data: { course: data } }
}

export const getCategories = async () => {
    const { data, error } = await supabase
        .from('courses')
        .select('category')
    
    if (error) throw error
    const categories = [...new Set(data.map(c => c.category))]
    return { data: { categories } }
}

export const createCourse = (data) => supabase.from('courses').insert([data])
export const updateCourse = (id, data) => supabase.from('courses').update(data).eq('id', id)
export const deleteCourse = (id) => supabase.from('courses').delete().eq('id', id)
