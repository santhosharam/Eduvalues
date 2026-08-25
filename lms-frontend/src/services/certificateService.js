import api from './api'

export const getMyCertificates = () => api.get('/certificates/my')
export const downloadCertificate = (id) => api.get(`/certificates/download/${id}`, { responseType: 'blob' })
export const verifyCertificate = (code) => api.get(`/certificates/verify/${code}`)
export const completeCourse = (courseId) => api.post('/certificates/complete', { courseId })
export const emailCertificate = (id) => api.post(`/certificates/email/${id}`)
export const emailCertificateImage = (id, formData) => api.post(`/certificates/email-image/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
})
