import api from './api'

export const getMyCertificates = () => api.get('/certificates/my')
export const downloadCertificate = (id) => api.get(`/certificates/download/${id}`, { responseType: 'blob' })
export const verifyCertificate = (code) => api.get(`/certificates/verify/${code}`)
export const completeCourse = (courseId) => api.post('/certificates/complete', { courseId })
