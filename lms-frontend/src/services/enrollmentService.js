import api from './api'

export const getMyEnrollments = () => api.get('/enrollments/my')
export const checkEnrollment = (courseId) => api.get(`/enrollments/${courseId}/status`)
