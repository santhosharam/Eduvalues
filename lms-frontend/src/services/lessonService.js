import api from './api'

export const getLessonById = async (id) => {
    const res = await api.get(`/lessons/${id}`)
    return res
}

export const getLessonsByCourseId = async (courseId) => {
    const res = await api.get(`/lessons/course/${courseId}`)
    return res
}

export const createLesson = (data) => api.post('/lessons', data)
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data)
export const deleteLesson = (id) => api.delete(`/lessons/${id}`)
