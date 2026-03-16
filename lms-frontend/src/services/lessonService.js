import { supabase } from './supabaseClient'

export const getLessonById = async (id) => {
    const { data, error } = await supabase
        .from('lessons')
        .select('*, course:course_id(*)')
        .eq('id', id)
        .single()
    
    if (error) throw error
    return { data: { lesson: data } }
}

export const getLessonsByCourseId = async (courseId) => {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true })
    
    if (error) throw error
    return { data: { lessons: data || [] } }
}
