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

const normalizeCourse = (c) => {
    if (!c) return null
    return {
        ...c,
        _id: c.id,
        shortDescription: c.short_description || c.shortDescription,
        discountPrice: c.discount_price || c.discountPrice,
        isPublished: c.is_published !== undefined ? c.is_published : c.isPublished,
        lessons: (c.lessons || []).map(normalizeLesson).sort((a, b) => (a.order || 0) - (b.order || 0))
    }
}

export const getAllCourses = async (params = {}) => {
    let query = supabase.from('courses').select('*, lessons(*)')
    
    if (params.category) query = query.eq('category', params.category)
    if (params.level) query = query.eq('level', params.level)
    if (params.limit) query = query.limit(params.limit)
    if (params.search) query = query.ilike('title', `%${params.search}%`)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    const courses = (data || []).map(normalizeCourse)
    return { data: { courses } }
}

export const getCourseBySlug = async (slug) => {
    let query = supabase.from('courses').select('*, lessons(*)')
    
    // Check if it looks like a Supabase UUID or Slug
    const isUuid = slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    
    if (isUuid) {
        query = query.or(`slug.eq.${slug},id.eq.${slug}`)
    } else {
        query = query.eq('slug', slug)
    }

    const { data, error } = await query.single()
    if (error) throw error
    return { data: { course: normalizeCourse(data) } }
}

export const getCourseById = async (id) => {
    const { data, error } = await supabase.from('courses').select('*, lessons(*)').eq('id', id).single()
    if (error) throw error
    return { data: { course: normalizeCourse(data) } }
}

export const getCategories = async () => {
    const { data, error } = await supabase.from('courses').select('category')
    if (error) throw error
    const categories = [...new Set(data.map(item => item.category))]
    return { data: { categories } }
}

export const createCourse = (data) => supabase.from('courses').insert([data]).select().single()
export const updateCourse = (id, data) => supabase.from('courses').update(data).eq('id', id).select().single()
export const deleteCourse = (id) => supabase.from('courses').delete().eq('id', id)
