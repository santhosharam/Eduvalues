import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminForm from '../../components/admin/AdminForm';
import { Plus, Edit, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const FORM_FIELDS = [
    { name: 'panel_number', label: 'Panel Number', type: 'number', required: true },
    { name: 'image_url', label: 'Image URL', placeholder: 'e.g. /comics/lesson1/panel1.png', required: true },
    { name: 'caption', label: 'Caption', type: 'textarea', placeholder: 'Dialogue or description...', rows: 3 },
];

export default function ManageComics() {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [panels, setPanels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editPanel, setEditPanel] = useState(null);

    useEffect(() => {
        fetchLessonData();
        fetchPanels();
    }, [lessonId]);

    const fetchLessonData = async () => {
        const { data, error } = await supabase.from('lessons').select('title').eq('id', lessonId).single();
        if (error) toast.error('Error fetching lesson');
        else setLesson(data);
    };

    const fetchPanels = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('comic_panels')
                .select('*')
                .eq('lesson_id', lessonId)
                .order('panel_number', { ascending: true });
            if (error) throw error;
            setPanels(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error(err.message || 'Failed to load comic panels');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (editPanel) {
                const { error } = await supabase
                    .from('comic_panels')
                    .update(formData)
                    .eq('id', editPanel.id);
                if (error) throw error;
                toast.success('Panel updated');
            } else {
                const { error } = await supabase
                    .from('comic_panels')
                    .insert([{ ...formData, lesson_id: lessonId }]);
                if (error) throw error;
                toast.success('Panel added');
            }
            setShowModal(false);
            fetchPanels();
        } catch (err) {
            console.error('Fetch questions error:', err);
            toast.error(err.message || 'Failed to load questions');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this panel?')) return;
        try {
            const { error } = await supabase.from('comic_panels').delete().eq('id', id);
            if (error) throw error;
            toast.success('Panel deleted');
            fetchPanels();
        } catch (err) {
            toast.error('Error deleting panel');
        }
    };

    return (
        <AdminLayout
            title="Comics Manager"
            subtitle={lesson ? `Designing Panels for: ${lesson.title}` : 'Loading lesson...'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <button onClick={() => navigate('/admin/lessons')} style={backBtnStyle}>
                    <ArrowLeft size={18} /> Back to Lessons
                </button>
                <button onClick={() => { setEditPanel(null); setShowModal(true); }} style={addBtnStyle}>
                    <Plus size={18} /> Add New Panel
                </button>
            </div>

            <AdminTable
                headers={['Panel #', 'Preview', 'Caption', 'Actions']}
                loading={loading}
                data={panels}
                renderRow={(panel) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={badgeStyle}>#{panel.panel_number}</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={previewBoxStyle}>
                                {panel.image_url ? (
                                    <img src={panel.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <ImageIcon size={20} color="#334155" />
                                )}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ color: '#94a3b8', fontSize: 13, maxWidth: 400 }}>{panel.caption || 'No caption'}</div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setEditPanel(panel); setShowModal(true); }} style={actionBtnStyle}><Edit size={16} /></button>
                                <button onClick={() => handleDelete(panel.id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }}><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />

            <AdminModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editPanel ? 'Edit Comic Panel' : 'Add New Panel'}
                subtitle="Specify the order, image path, and dialog for this panel."
            >
                <AdminForm
                    fields={FORM_FIELDS}
                    initialData={editPanel || { panel_number: panels.length + 1, image_url: '', caption: '' }}
                    loading={actionLoading}
                    onCancel={() => setShowModal(false)}
                    onSubmit={handleSave}
                />
            </AdminModal>
        </AdminLayout>
    );
}

const backBtnStyle = {
    background: 'none', border: 'none', color: '#64748b', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
};

const addBtnStyle = {
    background: '#00A6C0', color: '#fff', padding: '12px 24px', borderRadius: '14px', border: 'none', fontWeight: 900, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 16px rgba(0, 166, 192, 0.2)'
};

const badgeStyle = { width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 900, fontSize: 12 };

const previewBoxStyle = { width: 80, height: 45, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const actionBtnStyle = { width: 40, height: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' };
