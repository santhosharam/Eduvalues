import api from './api'

export const initiatePayment = (courseId) => api.post('/payments/initiate', { courseId })
export const verifyPayment = (data) => api.post('/payments/verify', data)
export const getMyPayments = () => api.get('/payments/history')
export const getAllPayments = () => api.get('/payments/all')
