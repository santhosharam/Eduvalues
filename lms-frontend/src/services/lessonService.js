import { supabase } from '../supabaseClient'

const normalizeLesson = (l) => {
    if (!l) return null
    return {
        ...l,
        _id: l.id,
        videoUrl: l.video_url || l.videoUrl,
        isFree: l.is_free !== undefined ? l.is_free : l.isFree
    }
}

export const getLessonById = async (id) => {
    const { data, error } = await supabase.from('lessons').select('*').eq('id', id).single()
    if (error) throw error
    return { data: { lesson: normalizeLesson(data) } }
}

export const getLessonsByCourseId = async (courseId) => {
    const { data, error } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true })
    if (error) throw error
    const lessons = (data || []).map(normalizeLesson)
    return { data: { lessons } }
}

export const createLesson = (data) => supabase.from('lessons').insert([data]).select().single()
export const updateLesson = (id, data) => supabase.from('lessons').update(data).eq('id', id).select().single()
export const deleteLesson = (id) => supabase.from('lessons').delete().eq('id', id)
