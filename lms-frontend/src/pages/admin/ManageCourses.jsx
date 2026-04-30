import { useEffect, useState } from 'react';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../../services/courseService';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminForm from '../../components/admin/AdminForm';
import { Plus, Edit, Trash2 } from 'lucide-react';

const EMPTY_COURSE = {
    title: '', category: '', instructor: '', duration: '',
    level: 'beginner', thumbnail: '', shortDescription: '', description: ''
};

const FORM_FIELDS = [
    { name: 'title', label: 'Course Title', placeholder: 'e.g. Master React in 30 Days', required: true },
    { name: 'category', label: 'Category', placeholder: 'e.g. Web Development', required: true },
    { name: 'instructor', label: 'Lead Instructor', placeholder: 'e.g. Dr. Jane Smith', required: true },
    { name: 'duration', label: 'Total Duration', placeholder: 'e.g. 15h 45m', required: true },
    {
        name: 'level', label: 'Skill Level', type: 'select',
        options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' }
        ],
        required: true
    },
    { name: 'thumbnail', label: 'Thumbnail URL', placeholder: 'https://images.unsplash.com/...' },
    { name: 'shortDescription', label: 'Elevator Pitch', placeholder: 'One sentence hook...', required: true },
    { name: 'description', label: 'Full Curriculum Overview', type: 'textarea', placeholder: 'Detailed description of the course...', required: true }
];

export default function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editCourse, setEditCourse] = useState(null);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const r = await getAllCourses({ all: true });
            setCourses(r.data.courses || []);
        } catch { toast.error('Failed to sync courses'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            const { price, discountPrice, ...payload } = data;
            if (editCourse) {
                await updateCourse(editCourse.id || editCourse._id, payload);
                toast.success('Course parameters updated.');
            } else {
                await createCourse(payload);
                toast.success('New course added to catalog.');
            }
            setShowModal(false);
            fetchCourses();
        } catch (err) {
            toast.error(err.message || 'Transaction failed');
        } finally { setActionLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE ACTION: Are you sure you want to purge this course and all associated lessons?')) return;
        try {
            await deleteCourse(id);
            toast.success('Course purged successfully.');
            fetchCourses();
        } catch { toast.error('Access denied or system error'); }
    };

    const openCreate = () => { setEditCourse(null); setShowModal(true); };
    const openEdit = (course) => { setEditCourse(course); setShowModal(true); };

    return (
        <AdminLayout
            title="Course Catalog"
            subtitle={`Orchestrate and manage ${courses.length} active educational paths.`}
        >
            {/* Header Action Hub */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                <button
                    onClick={openCreate}
                    style={{
                        padding: '14px 28px',
                        background: '#00A6C0',
                        color: '#fff',
                        borderRadius: '16px',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0, 166, 192, 0.2)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#00B8D4'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#00A6C0'; }}
                >
                    <Plus size={18} /> Add New Course
                </button>
            </div>

            {/* Courses Data Grid */}
            <AdminTable
                headers={['Metadata', 'Categorization', 'Status']}
                loading={loading}
                data={courses}
                renderRow={(course) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ width: 60, height: 42, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <img src={course.thumbnail || `https://picsum.photos/seed/${course.id || course._id}/60/42`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{course.title}</div>
                                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>ID: {(course.id || course._id || '').substring(0, 8)}...</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 700 }}>{course.category}</div>
                            <div style={{
                                display: 'inline-block',
                                marginTop: 6,
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                background: course.level === 'beginner' ? 'rgba(29, 209, 161, 0.1)' : 'rgba(255, 159, 67, 0.1)',
                                color: course.level === 'beginner' ? '#1DD1A1' : '#FF9F43'
                            }}>
                                {course.level}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: (course.is_published || course.isPublished) ? '#1DD1A1' : '#64748b' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: (course.is_published || course.isPublished) ? '#1DD1A1' : '#64748b' }}>
                                    {(course.is_published || course.isPublished) ? 'Live' : 'Draft'}
                                </span>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button onClick={() => openEdit(course)} style={actionBtnStyle} title="Modify Parameters"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(course.id || course._id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }} title="Purge Record"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />

            {/* Course Modification Modal */}
            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editCourse ? 'Modify Course Asset' : 'Blueprint New Course'}
                subtitle={editCourse ? `Target ID: ${editCourse.id || editCourse._id}` : 'Initialize a new learning pathway in the ecosystem.'}
                width={720}
            >
                <AdminForm
                    fields={FORM_FIELDS}
                    initialData={editCourse || EMPTY_COURSE}
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
