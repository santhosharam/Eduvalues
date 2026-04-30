import { supabase } from '../supabaseClient'

export const getLessonById = async (id) => {
    // Check if the id is a UUID (Supabase format) or MongoDB format
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    
    if (isUuid) {
        // Fetch lesson and join with comic_panels
        const { data, error } = await supabase
            .from('lessons')
            .select(`
                *,
                panels:comic_panels(*)
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return { data: { lesson: data } }
    } else {
        // Fallback to local API for MongoDB IDs
        const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/${id}`)
        return res.json()
    }
}

export const getLessonsByCourseId = async (courseId) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId)

    if (isUuid) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index')

        if (error) throw error
        return { data: { lessons: data } }
    } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/lessons/course/${courseId}`)
        return res.json()
    }
}
