import { supabase } from '../supabaseClient'

export const getAllCourses = async (params = {}) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)

    if (error) {
        // Fallback to local API if Supabase fails or is empty
        const res = await fetch(`${import.meta.env.VITE_API_URL}/courses`)
        return res.json()
    }
    return { data: { courses: data } }
}

export const getCourseBySlug = async (slug) => {
    // Check if it's actually an ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug)
    
    if (isUuid) return getCourseById(slug)

    const { data, error } = await supabase
        .from('courses')
        .select(`
            *,
            lessons(*)
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/courses/${slug}`)
        return res.json()
    }
    return { data: { course: data } }
}

export const getCourseById = async (id) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)

    if (isUuid) {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                lessons(*)
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return { data: { course: data } }
    } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/courses/id/${id}`)
        return res.json()
    }
}
