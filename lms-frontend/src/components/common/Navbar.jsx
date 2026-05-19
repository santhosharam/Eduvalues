import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    Menu, X, User, LogOut, LayoutDashboard,
    Phone, Mail, Facebook, Instagram, Twitter,
    BookOpen, Heart, Rocket, Smile, Home, MapPin
} from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/courses', label: 'Our Courses' },
        { to: '/blog', label: 'Insights' },
        ...(user ? [{ to: '/dashboard/playground', label: 'Playground 🎮' }] : []),
        { to: '/contact', label: 'Call Us' },
        { to: '/dashboard', label: 'Account' },
    ]

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1000,
            borderBottom: '3px solid #F1F1F1',
            boxShadow: '0 8px 0 rgba(0,0,0,0.02)',
            transition: 'all 0.3s ease'
        }}>
            {/* --- Main Navbar --- */}
            <div className="section-container" style={{ height: '76px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                        src="/logo.png"
                        alt="VE Value Education"
                        style={{ height: '52px', width: 'auto', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>
 
                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
                    {navLinks.filter(l => l.to !== '/dashboard').map(({ to, label }) => {
                        const isActive = location.pathname === to
                        return (
                            <Link key={to} to={to} style={{
                                textDecoration: 'none',
                                color: isActive ? '#00A6C0' : '#001F3F',
                                fontSize: 16,
                                fontWeight: 900,
                                fontFamily: 'Fredoka',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                position: 'relative',
                                transition: 'color 0.2s'
                            }}>
                                {label}
                                {isActive && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: -6,
                                        left: 0,
                                        width: '100%',
                                        height: 3,
                                        background: '#00A6C0',
                                        borderRadius: 2
                                    }} />
                                )}
                            </Link>
                        )
                    })}
 
                    {user ? (
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <Link to="/dashboard" style={{ 
                                textDecoration: 'none', 
                                color: '#001F3F', 
                                fontSize: 15, 
                                fontWeight: 900, 
                                fontFamily: 'Fredoka',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 6,
                                background: '#E0F7FA',
                                padding: '8px 16px',
                                borderRadius: 16,
                                border: '2px solid #B2EBF2'
                            }}>
                                <User size={16} color="#00A6C0" /> Account
                            </Link>
                            <button onClick={logout} style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#94a3b8', 
                                fontSize: 15, 
                                fontWeight: 900, 
                                fontFamily: 'Fredoka',
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 6 
                            }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ 
                            textDecoration: 'none', 
                            padding: '10px 20px', 
                            borderRadius: 16, 
                            fontSize: 14, 
                            fontWeight: 900,
                            fontFamily: 'Fredoka',
                            height: 'auto',
                            background: '#00A6C0',
                            color: '#fff',
                            boxShadow: '0 4px 0 #00879d',
                            border: 'none'
                        }}>
                            Sign In
                        </Link>
                    )}
                </nav>
 
                {/* Mobile Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: '#F4F7F9', border: '3px solid #E4EBF0', color: '#001F3F', padding: 10, borderRadius: 12, cursor: 'pointer', display: 'none' }}
                    className="mobile-toggle"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
 
            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', padding: 24, boxShadow: '0 15px 0 #F1F1F1', borderBottom: '3px solid #F1F1F1', zIndex: 1000 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {navLinks.filter(l => l.to !== '/dashboard').map(({ to, label }) => (
                            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#001F3F', fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka' }}>{label}</Link>
                        ))}
                        
                        <div style={{ borderTop: '3px solid #F1F1F1', paddingTop: 20 }}>
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#001F3F', fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka', display: 'block', marginBottom: 20 }}>
                                        My Account
                                    </Link>
                                    <button onClick={() => { logout(); setMenuOpen(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka', padding: 0 }}>Logout</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#00A6C0', fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka' }}>Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
 
            <style>{`
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
            `}</style>
        </header>
    )
}
