import api from './api'

export const getAllCourses = (params) => api.get('/courses', { params })
export const getCourseBySlug = (slug) => api.get(`/courses/${slug}`)
export const getCategories = () => api.get('/courses/categories')
export const createCourse = (data) => api.post('/courses', data)
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/courses/${id}`)
