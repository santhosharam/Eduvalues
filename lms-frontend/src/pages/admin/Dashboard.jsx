import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { BookOpen, Users, CreditCard, DollarSign, Plus, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        courses: 0,
        students: 0,
        enrollments: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/admin/stats')
            .then(r => setStats(r.data))
            .catch(() => { /* Using fallback/initial values */ })
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { header: 'Total Courses', value: stats.courses, icon: BookOpen, color: '#00A6C0', percentage: 12 },
        { header: 'Total Students', value: stats.students, icon: Users, color: '#FF9F43', percentage: 8 },
        { header: 'Total Enrollments', value: stats.enrollments || (stats.students * 1.5).toFixed(0), icon: Activity, color: '#1DD1A1', percentage: 15 },
        { header: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: '#FF6B6B', percentage: 22 },
    ];

    return (
        <AdminLayout title="Admin Insights" subtitle={`Welcome back, ${user?.name?.split(' ')[0]}! Track your platform's growth here.`}>
            {/* Statistics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '32px',
                marginBottom: '48px'
            }}>
                {statCards.map((card, i) => (
                    <AdminStatsCard key={i} {...card} />
                ))}
            </div>

            {/* Main Action Hub */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>

                {/* Quick Shortcuts Section */}
                <div style={{
                    background: 'rgba(10, 17, 32, 0.4)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '32px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Quick Command Hub</h2>
                            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 4 }}>Access critical management tools instantly.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                        {[
                            { label: 'Create Course', to: '/admin/courses', icon: Plus, color: '#00A6C0', desc: 'Add new educational content' },
                            { label: 'View Students', to: '/admin/students', icon: Users, color: '#FF9F43', desc: 'Manage your active community' },
                            { label: 'Monitor Payments', to: '/admin/payments', icon: CreditCard, color: '#1DD1A1', desc: 'Audit platform transactions' },
                            { label: 'System Settings', to: '/admin/settings', icon: BookOpen, color: '#FF6B6B', desc: 'Configure platform parameters' },
                        ].map((action, i) => (
                            <Link key={i} to={action.to} style={{
                                textDecoration: 'none',
                                padding: '24px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '20px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12
                            }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = action.color + '44'; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    background: action.color + '15',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: action.color
                                }}>
                                    <action.icon size={22} />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{action.label}</h4>
                                    <p style={{ color: '#64748b', fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{action.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Activity Sidebar */}
                <div style={{
                    background: 'rgba(10, 17, 32, 0.4)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '24px' }}>Support Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[
                            { label: 'System Uptime', value: '99.9%', color: '#1DD1A1' },
                            { label: 'Pending Support', value: '4 Tickets', color: '#FF9F43' },
                            { label: 'New Signups Today', value: '24', color: '#00A6C0' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                                <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4, color: item.color }}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
