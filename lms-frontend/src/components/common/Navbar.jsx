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
        { to: '/contact', label: 'Call Us' },
        { to: '/dashboard', label: 'Account' },
    ]

    return (
        <header style={{
            position: 'relative',
            background: '#fff',
            transition: 'all 0.3s ease'
        }}>
            {/* --- Top Info Bar --- */}
            <div style={{ 
                background: '#fff', 
                color: '#555', 
                padding: '12px 24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderBottom: '1px solid #f0f0f0',
                fontSize: '13px',
                fontWeight: 600
            }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="nav-info-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={16} color="#00A6C0" /> Chennai
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={16} color="#00A6C0" /> +91 98842 70368
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={16} color="#00A6C0" /> eduvalues123@gmail.com
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <a href="#" style={{ color: '#555', transition: 'color 0.2s' }}>
                        <Instagram size={18} />
                    </a>
                    <a href="#" style={{ color: '#555', transition: 'color 0.2s' }}>
                        <Twitter size={18} />
                    </a>
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
                        {/* Auth buttons removed - Login no longer required */}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    .nav-info-left { display: none !important; }
                }
                @media (min-width: 901px) {
                    .mobile-toggle { display: none !important; }
                }
            `}</style>
        </header>
    )
}
