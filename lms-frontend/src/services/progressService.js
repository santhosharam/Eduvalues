import api from './api'

/**
 * Mark a lesson as completed in the backend.
 * Production-ready implementation with error handling.
 */
export const markLessonComplete = async (courseId, lessonId) => {
    try {
        const { data } = await api.post(`/progress/${courseId}/lesson/${lessonId}`)
        return data
    } catch (err) {
        console.error('Error marking lesson as complete:', err)
        throw err
    }
}

/**
 * Get progress for a specific course
 */
export const getCourseProgress = async (courseId) => {
    const { data } = await api.get(`/progress/${courseId}`)
    return data
}

/**
 * Submit the final assessment for a course
 */
export const submitFinalAssessment = async (courseId, answers) => {
    const { data } = await api.post(`/progress/${courseId}/final-assessment`, { answers })
    return { data }
}
