import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import { Palette, HelpCircle, Search, Layers, BookOpen } from 'lucide-react';

export default function ManageLessonContent() {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAllLessons();
    }, []);

    const fetchAllLessons = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select(`
                    *,
                    courses (title)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setLessons(data || []);
        } catch (err) {
            console.error('Error fetching lessons:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = lessons.filter(l => 
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.courses?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Unified Content Manager"
            subtitle="Search through all lessons and quickly manage their comics, quizzes, or instructional text."
        >
            <div style={{ marginBottom: '32px', position: 'relative', maxWidth: '500px' }}>
                <Search size={18} color="#64748b" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                    type="text" 
                    placeholder="Search by lesson or course title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchFieldStyle}
                />
            </div>

            <AdminTable
                headers={['Asset Context', 'Primary Pathway', 'Rapid Actions']}
                loading={loading}
                data={filtered}
                renderRow={(lesson) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={iconBoxStyle('#00A6C0')}><BookOpen size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{lesson.title}</div>
                                    <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginTop: 2 }}>Order Index: #{lesson.order_index}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Layers size={14} color="#64748b" />
                                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{lesson.courses?.title || 'Standalone Asset'}</span>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button 
                                    onClick={() => navigate(`/admin/lessons/${lesson.id}/comics`)} 
                                    style={{ ...actionBtnStyle, color: '#00A6C0', background: 'rgba(0,166,192,0.1)' }}
                                >
                                    <Palette size={16} style={{ marginRight: 8 }} /> Comic Manager
                                </button>
                                <button 
                                    onClick={() => navigate(`/admin/lessons/${lesson.id}/quiz`)} 
                                    style={{ ...actionBtnStyle, color: '#FF9F43', background: 'rgba(255,159,67,0.1)' }}
                                >
                                    <HelpCircle size={16} style={{ marginRight: 8 }} /> Quiz Builder
                                </button>
                            </div>
                        </td>
                    </>
                )}
            />
        </AdminLayout>
    );
}

const searchFieldStyle = {
    width: '100%', padding: '14px 20px 14px 48px', background: 'rgba(5, 10, 20, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px',
    color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none', transition: 'all 0.2s'
};

const iconBoxStyle = (color) => ({
    width: 40, height: 40, background: color + '15', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, border: '1px solid ' + color + '33'
});

const actionBtnStyle = {
    padding: '8px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s'
};
