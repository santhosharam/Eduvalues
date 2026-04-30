import api from './api'

export const getLessonById = async (id) => {
    return api.get(`/lessons/${id}`)
}

export const getLessonsByCourseId = async (courseId) => {
    return api.get(`/lessons/course/${courseId}`)
}

export const createLesson = (data) => api.post('/lessons', data)
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data)
export const deleteLesson = (id) => api.delete(`/lessons/${id}`)
