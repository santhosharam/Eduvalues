import { supabase } from './supabaseClient'

export const getLessonById = async (id) => {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
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
        .order('order_index', { ascending: true })
    
    if (error) throw error
    return { data: { lessons: data } }
}

export const createLesson = (data) => supabase.from('lessons').insert([data])
export const updateLesson = (id, data) => supabase.from('lessons').update(data).eq('id', id)
export const deleteLesson = (id) => supabase.from('lessons').delete().eq('id', id)
