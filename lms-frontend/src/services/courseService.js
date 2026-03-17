import api from './api'

export const getAllCourses = async (params = {}) => {
    const res = await api.get('/courses', { params })
    return res
}

export const getCourseBySlug = async (slug) => {
    const res = await api.get(`/courses/${slug}`)
    return res
}

export const getCourseById = async (id) => {
    const res = await api.get(`/courses/id/${id}`)
    return res
}

export const getCategories = async () => {
    const res = await api.get('/courses/categories')
    return res
}

export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)
