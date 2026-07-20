import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import { Trash2, Search, Users, Mail, Shield, UserX, Clock } from 'lucide-react';

export default function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const r = await api.get('/admin/students');
            setStudents(r.data.students || []);
        } catch { toast.error('Failed to sync student database'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('IRREVERSIBLE: Purge student account and all enrollment history?')) return;
        try {
            await api.delete(`/admin/students/${id}`);
            toast.success('Account purged from registry.');
            fetchStudents();
        } catch { toast.error('Action Restricted'); }
    };

    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout
            title="Student Registry"
            subtitle={`Managing ${students.length} verified learners in the ecosystem.`}
        >
            {/* Command Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: 20 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 450 }}>
                    <Search
                        size={18}
                        color="#475569"
                        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by name, email, or student ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={searchFieldStyle}
                    />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Users size={16} color="#00A6C0" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{students.length} Total</span>
                    </div>
                </div>
            </div>

            {/* Students Data Grid */}
            <AdminTable
                headers={['Identity', 'Authentication', 'Chronology', 'Access Level']}
                loading={loading}
                data={filtered}
                renderRow={(student) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    background: student.role === 'admin' ? 'linear-gradient(135deg, #FF9F43, #FF6B6B)' : 'linear-gradient(135deg, #00A6C0, #001F3F)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 900,
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                }}>
                                    {student.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{student.name}</div>
                                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>ID: {student._id.substring(0, 8)}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                                <Mail size={14} color="#00A6C0" />
                                {student.email}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12, fontWeight: 700 }}>
                                <Clock size={14} />
                                Joined {new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: '10px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                background: student.role === 'admin' ? 'rgba(255, 159, 67, 0.1)' : 'rgba(29, 209, 161, 0.1)',
                                color: student.role === 'admin' ? '#FF9F43' : '#1DD1A1',
                                border: `1px solid ${student.role === 'admin' ? 'rgba(255,159,67,0.2)' : 'rgba(29,209,161,0.2)'}`
                            }}>
                                <Shield size={12} />
                                {student.role}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button style={actionBtnStyle} title="Suspend Temporary"><UserX size={16} /></button>
                                <button onClick={() => handleDelete(student._id)} style={{ ...actionBtnStyle, color: '#FF6B6B' }} title="Purge Record"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />
        </AdminLayout>
    );
}

const actionBtnStyle = {
    width: 40, height: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
};

const searchFieldStyle = {
    width: '100%', padding: '14px 20px 14px 48px', background: 'rgba(5, 10, 20, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px',
    color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none', transition: 'all 0.2s'
};
