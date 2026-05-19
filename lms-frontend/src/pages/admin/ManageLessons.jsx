import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from '../../services/courseService';
import { getLessonsByCourseId, createLesson, updateLesson, deleteLesson } from '../../services/lessonService';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import TabbedLessonForm from '../../components/admin/TabbedLessonForm';
import { Plus, Edit, Trash2, Video, BookOpen, Layers, ChevronRight, Palette, HelpCircle } from 'lucide-react';

const EMPTY_LESSON = { 
    title: '', 
    order_index: 1, 
    video_url: '', 
    story: '', 
    reading_time: '5 mins',
    quick_summary: '',
    moral_value: '',
    learning_goals: '',
    parent_tip: '', 
    qa_items: '',
    todo_list: '',
    isFree: false 
};

const FORM_FIELDS = [
    { name: 'title', label: 'Lesson Title', placeholder: 'e.g. Kindness', required: true },
    { name: 'order_index', label: 'Order Index', type: 'number', required: true },
    
    { label: '--- LESSON METADATA ---', type: 'header' },
    { name: 'reading_time', label: '⏱️ Reading Time', placeholder: 'e.g. 10 mins', required: true },
    { name: 'quick_summary', label: '🚀 Quick Summary', type: 'textarea', placeholder: 'A short overview for the summary tab...', rows: 2 },
    { name: 'moral_value', label: '💎 Moral Value', placeholder: 'The core lesson for the moral tab...', required: true },

    { label: '--- LESSON ARCHITECTURE (STORY & GOALS) ---', type: 'header' },
    { name: 'story', label: '📖 The Story', type: 'textarea', placeholder: 'The main narrative...', rows: 6, required: true },
    { name: 'learning_goals', label: '🎯 What You\'ll Learn', type: 'textarea', placeholder: 'Bullet points (one per line)...', rows: 3 },
    { name: 'parent_tip', label: '💡 Parent Tip', type: 'textarea', placeholder: 'Guidance for parents...', rows: 2 },
    { name: 'qa_items', label: '💬 Text FAQ (Not the Quiz!)', type: 'textarea', placeholder: 'Add standard text Q&A here. (Use the Manage Quiz button in the table for MCQs)', rows: 4 },
    { name: 'todo_list', label: '✅ To-Do List', type: 'textarea', placeholder: 'Action items (one per line)...', rows: 3 },
    
    { label: '--- ASSETS & SETTINGS ---', type: 'header' },
    { name: 'video_url', label: '🎥 Video Link (Optional)', placeholder: 'YouTube/Vimeo link' },
    { name: 'isFree', label: '🔓 Free Preview?', type: 'checkbox' },
];

export default function ManageLessons() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editLesson, setEditLesson] = useState(null);

    const buildContentHtml = (data) => {
        const goals = data.learning_goals?.split('\n').filter(l => l.trim()).map(l => `<li>${l.trim()}</li>`).join('') || '';
        const todos = data.todo_list?.split('\n').filter(l => l.trim()).map(l => `<li><strong>Item:</strong> ${l.trim()}</li>`).join('') || '';
        
        return `
<div class="lesson-content">
    <section class="story-section">
        <h2 style="color: #FF6B6B;">Story: ${data.title}</h2>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; font-size: 0.9em; color: #666;">
            <span>⏱️ <strong>Time:</strong> ${data.reading_time || '5 mins'}</span>
            <span>💎 <strong>Moral:</strong> ${data.moral_value || 'N/A'}</span>
        </div>
        ${data.quick_summary ? `<p style="font-style: italic; background: #f9f9f9; padding: 10px; border-radius: 8px;"><strong>Summary:</strong> ${data.quick_summary}</p>` : ''}
        <p>${data.story?.replace(/\n/g, '</p><p>')}</p>
    </section>
    
    ${goals ? `
    <section class="learn-section" style="background: #FFF5F5; padding: 20px; border-radius: 15px; margin: 20px 0;">
        <h3 style="color: #FF6B6B;">What You'll Learn:</h3>
        <ul>${goals}</ul>
        ${data.parent_tip ? `<div class="parent-tip" style="border-left: 4px solid #FF6B6B; padding-left: 15px; margin-top: 15px;"><strong>Parent Tip:</strong> ${data.parent_tip}</div>` : ''}
    </section>` : ''}

    ${data.qa_items ? `
    <section class="qa-section" style="background: #FFF9F1; padding: 20px; border-radius: 15px; margin-top: 20px;">
        <h3 style="color: #FF9F43; margin-bottom: 15px;">Q&A</h3>
        <div class="qa-content">
            ${data.qa_items.split('|||').map(b => {
                const parts = b.split('===');
                if (!parts[0]) return '';
                return `
                <div style="margin-bottom: 15px; border-bottom: 1px solid #FFE8CC; padding-bottom: 10px;">
                    <div style="font-weight: 800; color: #001F3F; margin-bottom: 5px;">Q: ${parts[0]}</div>
                    <div style="color: #666;">A: ${parts[1] || ''}</div>
                </div>`;
            }).join('')}
        </div>
    </section>` : ''}

    ${todos ? `
    <section class="todo-section" style="background: #E8F5E9; padding: 20px; border-radius: 15px; margin-top: 20px;">
        <h3 style="color: #2E7D32;">${data.title} To-Do List</h3>
        <ul>${todos}</ul>
    </section>` : ''}
</div>`;
    };

    useEffect(() => {
        getAllCourses({ all: true }).then(r => {
            const fetchedCourses = r.data.courses || [];
            setCourses(fetchedCourses);
            if (fetchedCourses.length > 0) {
                const firstId = fetchedCourses[0].id || fetchedCourses[0]._id;
                setSelectedCourseId(firstId);
                setSelectedCourse(fetchedCourses[0]);
                fetchLessons(firstId);
            }
        });
    }, []);

    const fetchLessons = async (courseId) => {
        setLoading(true);
        try {
            const r = await getLessonsByCourseId(courseId);
            setLessons(r.data.lessons || []);
        } catch { toast.error('Failed to sync curriculum data'); }
        finally { setLoading(false); }
    };

    const handleCourseChange = (e) => {
        const id = e.target.value;
        const course = courses.find(c => (c.id || c._id) === id);
        setSelectedCourseId(id);
        setSelectedCourse(course);
        fetchLessons(id);
    };

    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            const formattedData = {
                ...data,
                content: buildContentHtml(data),
                course_id: selectedCourseId
            };

            if (editLesson) {
                await updateLesson(editLesson.id || editLesson._id, formattedData);
                toast.success('Lesson content revised.');
            } else {
                await createLesson(formattedData);
                toast.success('Lesson appended to curriculum.');
            }
            setShowModal(false);
            fetchLessons(selectedCourseId);
        } catch (err) {
            toast.error(err.message || 'Critical write error');
        } finally { setActionLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE: Purge this instructional asset?')) return;
        try {
            await deleteLesson(id);
            toast.success('Asset purged.');
            fetchLessons(selectedCourseId);
        } catch { toast.error('Deletion restricted'); }
    };

    return (
        <AdminLayout
            title="Curriculum Architect"
            subtitle="Manage your courses, lessons, comics and quizzes from one unified dashboard."
        >
            {/* Header Control Panel */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '32px',
                background: 'rgba(255,255,255,0.02)',
                padding: '20px 24px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Select Course:</label>
                    <select 
                        value={selectedCourseId} 
                        onChange={handleCourseChange}
                        style={selectStyle}
                    >
                        {courses.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => { setEditLesson(null); setShowModal(true); }}
                    style={addBtnStyle}
                >
                    <Plus size={18} /> Append New Lesson
                </button>
            </div>

            <AdminTable
                headers={['Seq', 'Label', 'Story Content', 'Actions']}
                loading={loading}
                data={lessons}
                renderRow={(lesson) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={seqBadgeStyle}>#{lesson.order_index}</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{lesson.title}</div>
                            {lesson.video_url && <div style={{ fontSize: 10, color: '#00A6C0', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Video size={10} /> Video Linked</div>}
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lesson.content || 'No text content added yet.'}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setEditLesson(lesson); setShowModal(true); }} style={actionBtnStyle} title="Edit Lesson"><Edit size={16} /></button>
                                <button onClick={() => navigate(`/admin/lessons/${lesson.id || lesson._id}/comics`)} style={{ ...actionBtnStyle, color: '#00A6C0', background: 'rgba(0,166,192,0.1)' }} title="Manage Comics"><Palette size={16} /></button>
                                <button onClick={() => navigate(`/admin/lessons/${lesson.id || lesson._id}/quiz`)} style={{ ...actionBtnStyle, color: '#FF9F43', background: 'rgba(255,159,67,0.1)' }} title="Manage Quiz"><HelpCircle size={16} /></button>
                                <button onClick={() => handleDelete(lesson.id || lesson._id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }} title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />

            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editLesson ? 'Refine Lesson Module' : 'Architect New Lesson'}
                subtitle={selectedCourse ? `Target Course: ${selectedCourse.title}` : ''}
                width={900}
            >
                <TabbedLessonForm
                    initialData={editLesson || { ...EMPTY_LESSON, order_index: lessons.length + 1 }}
                    loading={actionLoading}
                    onCancel={() => setShowModal(false)}
                    onSubmit={handleSave}
                    isNew={!editLesson}
                />
            </AdminModal>
        </AdminLayout>
    );
}

const selectStyle = {
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px 16px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    minWidth: '240px'
};

const addBtnStyle = {
    background: '#00A6C0',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '14px',
    border: 'none',
    fontWeight: 900,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 8px 16px rgba(0, 166, 192, 0.2)',
    transition: 'all 0.2s'
};

const seqBadgeStyle = { 
    width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.03)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', 
    fontWeight: 900, fontSize: 12 
};

const actionBtnStyle = {
    width: 36,
    height: 36,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s'
};
