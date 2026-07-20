import { supabase } from './supabaseClient';
import api from './api';

export const getAllCourses = async (options = {}) => {
    // For admin operations (options.all), always hit the API to ensure fresh data
    if (options.all) {
        const res = await api.get('/courses', { params: options });
        return { data: res.data };
    }

    try {
        const { data, error } = await supabase.from('courses').select('*, lessons(*)').eq('is_published', true);
        if (error || !data || data.length === 0) {
            const res = await api.get('/courses', { params: options });
            if (res.data?.courses) {
                res.data.courses.forEach(c => {
                    if (c.lessons) c.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                });
            }
            return { data: res.data };
        }
        data.forEach(c => {
            if (c.lessons) c.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        });
        return { data: { courses: data } };
    } catch (err) {
        const res = await api.get('/courses', { params: options });
        if (res.data?.courses) {
            res.data.courses.forEach(c => {
                if (c.lessons) c.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            });
        }
        return { data: res.data };
    }
};

export const getCourseById = async (id) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
        const { data, error } = await supabase
            .from('courses')
            .select('*, lessons(*)')
            .eq('id', id)
            .single();

        if (error || !data.lessons || data.lessons.length === 0) {
            const res = await api.get(`/courses/id/${id}`).catch(() => ({ data: { course: data } }));
            const courseObj = res.data?.course || data;
            if (courseObj?.lessons) {
                courseObj.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            }
            return { data: { course: courseObj } };
        }

        if (data?.lessons) {
            data.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }
        return { data: { course: data } };
    } else {
        const res = await api.get(`/courses/id/${id}`);
        if (res.data?.course?.lessons) {
            res.data.course.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }
        return { data: res.data };
    }
};

export const getCourseBySlug = async (slug) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) return getCourseById(slug);

    const { data, error } = await supabase
        .from('courses')
        .select('*, lessons(*)')
        .eq('slug', slug)
        .single();

    if (error || !data?.lessons || data.lessons.length === 0) {
        try {
            const res = await api.get(`/courses/${slug}`);
            if (res.data?.course) {
                const c = res.data.course;
                if (c.lessons) c.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                return { data: { course: c } };
            }
        } catch (err) {
            // Fallback to Supabase data if backend fails
        }
    }

    if (data?.lessons) {
        data.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    }
    return { data: { course: data } };
};

export const getCategories = async () => {
    return api.get('/courses/categories');
};

export const createCourse = async (data) => {
    return api.post('/courses', data);
};

export const updateCourse = async (id, data) => {
    return api.put(`/courses/${id}`, data);
};

export const deleteCourse = async (id) => {
    return api.delete(`/courses/${id}`);
};

export const getFinalExam = async (courseId) => {
    const res = await api.get(`/courses/${courseId}/final-exam`);
    return res.data;
};
