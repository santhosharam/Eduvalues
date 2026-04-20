import api from './api'

const normalizeLesson = (l) => {
    if (!l) return null
    return {
        ...l,
        _id: l._id || l.id,
        courseId: l.courseId || l.course_id || l.course, // Prioritize courseId
        videoUrl: l.videoUrl || l.video_url,
        isFree: l.isFree !== undefined ? l.isFree : l.is_free
    }
}

export const getLessonById = async (id) => {
    const { data } = await api.get(`/lessons/${id}`)
    return { data: { lesson: normalizeLesson(data.lesson) } }
}

export const getLessonsByCourseId = async (courseId) => {
    const { data } = await api.get(`/lessons/course/${courseId}`)
    return { data: { lessons: (data.lessons || []).map(normalizeLesson) } }
}

export const createLesson = (data) => api.post('/lessons', data)
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data)
export const deleteLesson = (id) => api.delete(`/lessons/${id}`)
