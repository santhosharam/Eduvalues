import api from './api'

export const getCourseProgress = (courseId) => api.get(`/progress/${courseId}`)
export const markLessonComplete = (courseId, lessonId) =>
    api.post(`/progress/${courseId}/lesson/${lessonId}`)
