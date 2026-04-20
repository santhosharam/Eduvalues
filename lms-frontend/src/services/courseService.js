import api from './api'

const normalizeLesson = (l) => {
    if (!l) return null
    return {
        ...l,
        _id: l._id || l.id,
        videoUrl: l.videoUrl || l.video_url,
        isFree: l.isFree !== undefined ? l.isFree : l.is_free
    }
}

const normalizeCourse = (c) => {
    if (!c) return null
    return {
        ...c,
        _id: c._id || c.id,
        shortDescription: c.shortDescription || c.short_description,
        discountPrice: c.discountPrice || c.discount_price,
        isPublished: c.isPublished !== undefined ? c.isPublished : c.is_published,
        lessons: (c.lessons || []).map(normalizeLesson).sort((a, b) => (a.order || 0) - (b.order || 0))
    }
}

export const getAllCourses = async (params = {}) => {
    const { data } = await api.get('/courses', { params })
    const courses = (data.courses || []).map(normalizeCourse)
    return { data: { courses } }
}

export const getCourseBySlug = async (slug) => {
    const { data } = await api.get(`/courses/${slug}`)
    return { data: { course: normalizeCourse(data.course) } }
}

export const getCourseById = async (id) => {
    const { data } = await api.get(`/courses/id/${id}`)
    return { data: { course: normalizeCourse(data.course) } }
}

export const getCategories = async () => {
    const { data } = await api.get('/courses/categories')
    return { data: { categories: data.categories } }
}

export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)
