import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    Menu, X, User, LogOut, LayoutDashboard,
    Phone, Mail, Facebook, Instagram, Twitter,
    BookOpen, Heart, Rocket, Smile, Home
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
        { to: '/contact', label: 'Call Us' },
        { to: '/dashboard', label: 'Account' },
    ]

    return (
        <header style={{
            position: 'relative',
            background: '#fff',
            transition: 'all 0.3s ease'
        }}>
            {/* --- Info Bar - Updated to Navy --- */}
            <div style={{ background: '#001F3F', color: '#fff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        +91-12345-67890
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        hello@valueeducation.in
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                </div>
            </div>

            {/* --- Main Navbar --- */}
            <div className="section-container" style={{ height: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                        src="/logo.png"
                        alt="VE Value Education"
                        style={{ height: '60px', width: 'auto' }}
                    />
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to} style={{
                            textDecoration: 'none',
                            color: location.pathname === to ? '#00A6C0' : '#555',
                            fontSize: 16,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            position: 'relative',
                            transition: 'color 0.2s'
                        }}>
                            {label}
                        </Link>
                    ))}

                    {user ? (
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="btn-primary" style={{ padding: '10px 24px', fontSize: 13, background: '#001F3F' }}>
                                    Admin Hub
                                </Link>
                            )}
                            <Link to="/dashboard" className="btn-secondary" style={{ padding: '10px 24px', fontSize: 14 }}>
                                Hello, {user.name.split(' ')[0]}
                            </Link>
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 10, fontWeight: 700 }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ padding: '12px 30px', fontSize: 14 }}>
                            Sign In
                        </Link>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ background: '#F4F7F9', border: 'none', color: '#001F3F', padding: 10, borderRadius: 12, cursor: 'pointer' }}
                    className="mobile-toggle"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {navLinks.map(({ to, label }) => (
                            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: '#555', fontSize: 18, fontWeight: 700 }}>{label}</Link>
                        ))}
                        {user ? (
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {user.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ background: '#001F3F' }}>Admin Hub</Link>
                                )}
                                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-secondary">Dashboard</Link>
                                <button onClick={logout} className="btn-outline">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary">Sign In</Link>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
                @media (min-width: 901px) {
                    .mobile-toggle { display: none !important; }
                }
            `}</style>
        </header>
    )
}
