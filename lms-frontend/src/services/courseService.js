import { supabase } from './supabaseClient';
import api from './api';

export const getAllCourses = async () => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true);

        if (error || !data || data.length === 0) {
            const res = await api.get('/courses');
            return res.data;
        }
        return { data: { courses: data } };
    } catch (err) {
        const res = await api.get('/courses');
        return res.data;
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

        if (error) throw error;
        return { data: { course: data } };
    } else {
        const res = await api.get(`/courses/id/${id}`);
        return res.data;
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

    if (error) {
        const res = await api.get(`/courses/${slug}`);
        return res.data;
    }
    return { data: { course: data } };
};

export const getCategories = async () => {
    return api.get('/courses/categories');
};

export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
