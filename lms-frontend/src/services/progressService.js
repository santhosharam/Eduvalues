import api from './api'

export const getCourseProgress = (courseId) => api.get(`/progress/${courseId}`)
export const markLessonComplete = (courseId, lessonId) =>
    api.post(`/progress/${courseId}/lesson/${lessonId}`)

export const submitFinalAssessment = (courseId, answers) =>
    api.post(`/progress/${courseId}/final-assessment`, { answers })
