import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminForm from '../../components/admin/AdminForm';
import { Plus, Edit, Trash2, Video, BookOpen, Layers, ChevronRight, Play } from 'lucide-react';

const EMPTY_LESSON = { title: '', description: '', videoUrl: '', content: '', order: 1, isFree: false };

const FORM_FIELDS = [
    { name: 'title', label: 'Lesson Title', placeholder: 'e.g. Introduction to Variables', required: true },
    { name: 'videoUrl', label: 'Streaming URL', placeholder: 'YouTube/Vimeo embed or direct .mp4' },
    { name: 'order', label: 'Chronological Sequence', type: 'number', required: true },
    { name: 'description', label: 'Lesson Synopsis', placeholder: 'Brief summary of objectives...' },
    { name: 'content', label: 'Instructional Body (Markdown/HTML)', type: 'textarea', placeholder: 'Full lesson text content...', rows: 8 },
];

export default function ManageLessons() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editLesson, setEditLesson] = useState(null);

    // Initial Fetch for course context
    useEffect(() => {
        api.get('/courses?all=true').then(r => setCourses(r.data.courses || []));
    }, []);

    const fetchLessons = async (courseId) => {
        setLoading(true);
        try {
            const r = await api.get(`/lessons/course/${courseId}`);
            setLessons(r.data.lessons || []);
        } catch { toast.error('Failed to sync curriculum data'); }
        finally { setLoading(false); }
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        fetchLessons(course._id);
    };

    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            if (editLesson) {
                await api.put(`/lessons/${editLesson._id}`, data);
                toast.success('Lesson content revised.');
            } else {
                await api.post('/lessons', { ...data, course: selectedCourse._id });
                toast.success('Lesson appended to curriculum.');
            }
            setShowModal(false);
            fetchLessons(selectedCourse._id);
        } catch { toast.error('Critical write error'); }
        finally { setActionLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE: Purge this instructional asset?')) return;
        try {
            await api.delete(`/lessons/${id}`);
            toast.success('Asset purged.');
            fetchLessons(selectedCourse._id);
        } catch { toast.error('Deletion restricted'); }
    };

    return (
        <AdminLayout
            title="Curriculum Architect"
            subtitle={selectedCourse ? `Modifying: ${selectedCourse.title}` : 'Select a course pathway to manage its instructional assets.'}
        >
            {/* Selection Grid for Courses */}
            {!selectedCourse ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {courses.map(course => (
                        <div
                            key={course._id}
                            onClick={() => handleSelectCourse(course)}
                            style={{
                                background: 'rgba(10, 17, 32, 0.4)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '24px',
                                padding: '24px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10, 17, 32, 0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{
                                width: 64, height: 64, background: '#00A6C015',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#00A6C0', border: '1px solid #00A6C033'
                            }}>
                                <Layers size={28} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>{course.title}</h3>
                                <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{course.lessons?.length || 0} Lessons Integrated</p>
                            </div>
                            <ChevronRight size={20} color="#334155" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Lesson Management Dashboard for Selected Course */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
                        <button
                            onClick={() => setSelectedCourse(null)}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            ← Switch Pathway
                        </button>
                        <button
                            onClick={() => { setEditLesson(null); setShowModal(true); }}
                            style={{
                                background: '#00A6C0',
                                color: '#fff',
                                padding: '12px 24px',
                                borderRadius: '14px',
                                border: 'none',
                                fontWeight: 900,
                                fontSize: 14,
                                cursor: 'pointer',
                                boxShadow: '0 8px 16px rgba(0, 166, 192, 0.2)'
                            }}
                        >
                            <Plus size={18} style={{ marginRight: 8 }} /> Append Lesson
                        </button>
                    </div>

                    <AdminTable
                        headers={['Sequence', 'Instructional Label', 'Assets', 'Metadata']}
                        loading={loading}
                        data={lessons}
                        renderRow={(lesson) => (
                            <>
                                <td style={{ padding: '20px 32px' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 900, fontSize: 12 }}>
                                        #{lesson.order}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 32px' }}>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{lesson.title}</div>
                                    <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginTop: 2 }}>{lesson.description?.substring(0, 60)}...</div>
                                </td>
                                <td style={{ padding: '20px 32px' }}>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {lesson.videoUrl && <div style={{ color: '#00A6C0' }} title="Video Component Integrated"><Video size={18} /></div>}
                                        {lesson.content && <div style={{ color: '#FF9F43' }} title="Instructional Text Present"><BookOpen size={18} /></div>}
                                    </div>
                                </td>
                                <td style={{ padding: '20px 32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: lesson.isFree ? '#1DD1A1' : '#64748b' }} />
                                        <span style={{ fontSize: 11, fontWeight: 900, color: lesson.isFree ? '#1DD1A1' : '#64748b', textTransform: 'uppercase' }}>
                                            {lesson.isFree ? 'Preview On' : 'Locked Access'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                        <button onClick={() => { setEditLesson(lesson); setShowModal(true); }} style={actionBtnStyle}><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(lesson._id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </>
                        )}
                    />
                </>
            )}

            {/* Lesson Architect Modal */}
            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editLesson ? 'Refine Lesson Module' : 'Architect New Lesson'}
                subtitle={selectedCourse ? `Constructing content for: ${selectedCourse.title}` : ''}
                width={800}
            >
                <AdminForm
                    fields={FORM_FIELDS}
                    initialData={editLesson || { ...EMPTY_LESSON, order: lessons.length + 1 }}
                    loading={actionLoading}
                    onCancel={() => setShowModal(false)}
                    onSubmit={handleSave}
                />
            </AdminModal>
        </AdminLayout>
    );
}

const actionBtnStyle = {
    width: 40,
    height: 40,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s'
};
