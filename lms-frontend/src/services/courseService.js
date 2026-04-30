import api from './api'

export const getAllCourses = async (params = {}) => {
    return api.get('/courses', { params })
}

export const getCourseBySlug = async (slug) => {
    return api.get(`/courses/${slug}`)
}

export const getCourseById = async (id) => {
    return api.get(`/courses/id/${id}`)
}

export const getCategories = async () => {
    return api.get('/courses/categories')
}

export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)
