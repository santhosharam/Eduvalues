import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminForm from '../../components/admin/AdminForm';
import { Plus, Edit, Trash2, ArrowLeft, HelpCircle, CheckCircle2 } from 'lucide-react';

const FORM_FIELDS = [
    { name: 'question', label: 'Question Text', type: 'textarea', placeholder: 'Enter the question...', required: true, rows: 3 },
    { name: 'option_a', label: 'Option A', placeholder: 'First option...', required: true },
    { name: 'option_b', label: 'Option B', placeholder: 'Second option...', required: true },
    { name: 'option_c', label: 'Option C', placeholder: 'Third option...', required: true },
    { name: 'option_d', label: 'Option D', placeholder: 'Fourth option...', required: true },
    {
        name: 'correct_answer', label: 'Correct Answer', type: 'select',
        options: [
            { label: 'Option A', value: 'A' },
            { label: 'Option B', value: 'B' },
            { label: 'Option C', value: 'C' },
            { label: 'Option D', value: 'D' },
        ],
        required: true
    },
    { name: 'order_index', label: 'Sort Order', type: 'number', required: true },
    { name: 'is_final_exam', label: 'Is this for Final Exam?', type: 'checkbox' },
];

export default function ManageQuiz() {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('lesson'); // 'lesson' or 'final'
    const [showModal, setShowModal] = useState(false);
    const [editQuestion, setEditQuestion] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [lessonId]);

    useEffect(() => {
        if (lesson) fetchQuestions();
    }, [viewMode, lesson]);

    const fetchInitialData = async () => {
        const { data, error } = await supabase
            .from('lessons')
            .select('title, courseId')
            .eq('id', lessonId)
            .single();
        
        if (error) toast.error('Error fetching lesson context');
        else setLesson(data);
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let query = supabase.from('quizzes').select('*');
            
            if (viewMode === 'final') {
                query = query.eq('courseId', lesson.courseId).eq('is_final_exam', true);
            } else {
                query = query.eq('lesson_id', lessonId).eq('is_final_exam', false);
            }

            const { data, error } = await query.order('order_index', { ascending: true });
            if (error) throw error;
            setQuestions(data || []);
        } catch (err) {
            console.error('Fetch quiz error:', err);
            toast.error(err.message || 'Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            const payload = {
                ...formData,
                lesson_id: lessonId,
                courseId: lesson.courseId,
                // Ensure boolean for is_final_exam
                is_final_exam: Boolean(formData.is_final_exam)
            };

            if (editQuestion) {
                const { error } = await supabase.from('quizzes').update(payload).eq('id', editQuestion.id);
                if (error) throw error;
                toast.success('Question updated');
            } else {
                const { error } = await supabase.from('quizzes').insert([payload]);
                if (error) throw error;
                toast.success('Question added to database');
            }
            setShowModal(false);
            fetchQuestions();
        } catch (err) {
            toast.error(err.message || 'Error saving quiz entry');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE: Delete this quiz question?')) return;
        try {
            const { error } = await supabase.from('quizzes').delete().eq('id', id);
            if (error) throw error;
            toast.success('Question removed');
            fetchQuestions();
        } catch (err) {
            toast.error('Error deleting entry');
        }
    };

    return (
        <AdminLayout
            title="Quiz Builder"
            subtitle={lesson ? `Lesson: ${lesson.title}` : 'Loading...'}
        >
            {/* Control Hub */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <button onClick={() => navigate('/admin/lessons')} style={backBtnStyle}>
                        <ArrowLeft size={18} /> Back
                    </button>
                    
                    <div style={tabContainerStyle}>
                        <button 
                            onClick={() => setViewMode('lesson')} 
                            style={viewMode === 'lesson' ? activeTabStyle : tabStyle}
                        >
                            <HelpCircle size={16} /> Lesson Quiz
                        </button>
                        <button 
                            onClick={() => setViewMode('final')} 
                            style={viewMode === 'final' ? activeTabStyle : tabStyle}
                        >
                            <CheckCircle2 size={16} /> Final Exam
                        </button>
                    </div>
                </div>

                <button onClick={() => { setEditQuestion(null); setShowModal(true); }} style={addBtnStyle}>
                    <Plus size={18} /> New Question
                </button>
            </div>

            <AdminTable
                headers={['#', 'Question', 'Options', 'Correct', 'Actions']}
                loading={loading}
                data={questions}
                renderRow={(q) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={badgeStyle}>{q.order_index}</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, maxWidth: 350 }}>{q.question}</div>
                            {q.is_final_exam && <div style={{ color: '#FF9F43', fontSize: 10, fontWeight: 900, marginTop: 4 }}>FINAL EXAM MATERIAL</div>}
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                                A: {q.option_a.substring(0, 20)}... | B: {q.option_b.substring(0, 20)}...
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={correctBadgeStyle}>Option {q.correct_answer}</div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setEditQuestion(q); setShowModal(true); }} style={actionBtnStyle}><Edit size={16} /></button>
                                <button onClick={() => handleDelete(q.id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }}><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />

            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editQuestion ? 'Refine Question' : 'Architect Question'}
                subtitle={viewMode === 'final' ? 'Creating for Course Final Exam' : 'Creating for Lesson Knowledge Check'}
            >
                <AdminForm
                    fields={FORM_FIELDS}
                    initialData={editQuestion || { order_index: questions.length + 1, is_final_exam: viewMode === 'final' }}
                    loading={actionLoading}
                    onCancel={() => setShowModal(false)}
                    onSubmit={handleSave}
                />
            </AdminModal>
        </AdminLayout>
    );
}

const backBtnStyle = { background: 'none', border: 'none', color: '#64748b', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

const tabContainerStyle = { display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' };

const tabStyle = { padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'none', color: '#64748b', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' };

const activeTabStyle = { ...tabStyle, background: '#00A6C0', color: '#fff', boxShadow: '0 4px 12px rgba(0, 166, 192, 0.2)' };

const addBtnStyle = { background: '#00A6C0', color: '#fff', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 16px rgba(0, 166, 192, 0.2)' };

const badgeStyle = { width: 28, height: 28, borderRadius: '6px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 900, fontSize: 11 };

const correctBadgeStyle = { padding: '4px 8px', borderRadius: '6px', background: 'rgba(29, 209, 161, 0.1)', color: '#1DD1A1', fontSize: 10, fontWeight: 900 };

const actionBtnStyle = { width: 40, height: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' };
