import { supabase } from '../supabaseClient'

export const getLessonById = async (id) => {
    const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single()
    if (error) throw error
    const lesson = { ...data, _id: data.id }
    return { data: { lesson } }
}

export const getLessonsByCourseId = async (courseId) => {
    const { data, error } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order', { ascending: true })
    if (error) throw error
    const lessons = (data || []).map(l => ({ ...l, _id: l.id }))
    return { data: { lessons } }
}

export const createLesson = (data) => supabase.from('lessons').insert([data]).select().single()
export const updateLesson = (id, data) => supabase.from('lessons').update(data).eq('id', id).select().single()
export const deleteLesson = (id) => supabase.from('lessons').delete().eq('id', id)
