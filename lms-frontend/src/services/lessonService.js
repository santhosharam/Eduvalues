import { supabase } from './supabaseClient';
import api from './api';

export const getLessonById = async (id) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    if (isUuid) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*, panels:comic_panels(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return { data: { lesson: data } };
    } else {
        const res = await api.get(`/lessons/${id}`);
        return { data: res.data };
    }
};

export const getLessonsByCourseId = async (courseId) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);

    if (isUuid) {
        const { data, error } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index');

        if (error) throw error;
        return { data: { lessons: data } };
    } else {
        const res = await api.get(`/lessons/course/${courseId}`);
        return { data: res.data };
    }
};

export const createLesson = async (data) => {
    const { data: result, error } = await supabase
        .from('lessons')
        .insert([data])
        .select()
        .single();
    if (error) {
        const res = await api.post('/lessons', data);
        return { data: res.data };
    }
    return { data: { lesson: result } };
};

export const updateLesson = async (id, data) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
        const { data: result, error } = await supabase
            .from('lessons')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return { data: { lesson: result } };
    }
    const res = await api.put(`/lessons/${id}`, data);
    return { data: res.data };
};

export const deleteLesson = async (id) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { data: { success: true } };
    }
    const res = await api.delete(`/lessons/${id}`);
    return { data: res.data };
};
