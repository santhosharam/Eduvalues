import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Globe, ChevronRight } from 'lucide-react';

export default function AdminHeader({ title, subtitle, onOpenSidebar }) {
    return (
        <header style={{
            background: 'rgba(10,17,32,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 32px',
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Mobile Hamburger */}
                <button
                    onClick={onOpenSidebar}
                    className="admin-hamburger"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'none',
                        width: 44,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px'
                    }}
                >
                    <Menu size={22} />
                </button>

                <div>
                    <h1 style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: '#fff',
                        lineHeight: 1.1,
                        fontFamily: 'Outfit, sans-serif'
                    }}>
                        {title}
                    </h1>
                    {subtitle && <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{subtitle}</p>}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {/* Global Search Interface Placeholder */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="admin-search">
                    <Search
                        size={18}
                        color="#64748b"
                        style={{ position: 'absolute', left: 16 }}
                    />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '12px 16px 12px 44px',
                            color: '#fff',
                            fontSize: 14,
                            width: 280,
                            fontWeight: 600,
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onFocus={e => { e.target.style.width = '320px'; e.target.style.borderColor = '#00A6C0'; }}
                        onBlur={e => { e.target.style.width = '280px'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                </div>

                {/* Navigation and Notification Tools */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button style={{
                        width: 44,
                        height: 44,
                        background: 'rgba(255,255,255,0.03)',
                        border: 'none',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#94a3b8'
                    }}>
                        <Bell size={20} />
                    </button>

                    <Link
                        to="/"
                        style={{
                            background: '#00A6C0',
                            color: '#fff',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontSize: 13,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 8px 16px rgba(0, 166, 192, 0.1)'
                        }}
                    >
                        <Globe size={16} /> Live Site
                    </Link>
                </div>
            </div>
        </header>
    );
}
