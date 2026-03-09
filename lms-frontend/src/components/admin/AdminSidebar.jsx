import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, BookOpen, Users, CreditCard,
    LogOut, ChevronRight, GraduationCap, Award, Settings, Video
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/lessons', icon: Video, label: 'Lessons' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/certificates', icon: Award, label: 'Certificates' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (item) =>
        item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

    return (
        <aside style={{
            width: 260,
            background: '#0a1120',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 50,
            transform: isOpen ? 'translateX(0)' : undefined,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }} className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo Section */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #00A6C0, #001F3F)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(0, 166, 192, 0.2)'
                    }}>
                        <GraduationCap size={22} color="white" />
                    </div>
                    <div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 800,
                            fontSize: 18,
                            color: '#fff',
                            letterSpacing: '0.5px'
                        }}>VE Admin</span>
                        <div style={{ fontSize: 10, color: '#00A6C0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: -2 }}>
                            Management Case
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation Section */}
            <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
                {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => {
                    const active = isActive({ to, exact });
                    return (
                        <Link key={to} to={to} onClick={onClose}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '12px 16px', borderRadius: '12px',
                                textDecoration: 'none', marginBottom: 6,
                                fontSize: 14, fontWeight: 600,
                                color: active ? '#fff' : '#94a3b8',
                                background: active ? 'rgba(0, 166, 192, 0.15)' : 'transparent',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                            {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4, background: '#00A6C0', borderRadius: '0 4px 4px 0' }} />}
                            <Icon size={18} color={active ? '#00A6C0' : '#64748b'} strokeWidth={active ? 2.5 : 2} />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile + Logout */}
            <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #001F3F, #00A6C0)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'white',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: '#00A6C0', fontWeight: 600 }}>Super Admin</div>
                    </div>
                </div>
                <button onClick={logout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8', cursor: 'pointer', padding: '12px',
                        borderRadius: '12px', fontSize: 13, fontWeight: 700,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                    <LogOut size={16} /> Logout System
                </button>
            </div>
        </aside>
    );
}
