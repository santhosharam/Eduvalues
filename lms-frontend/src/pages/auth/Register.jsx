import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Loader2, UserPlus, CheckCircle, Rocket, Smile } from 'lucide-react'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await register(formData)
            toast.success('Welcome to Kids LMS! 🚀')
            navigate('/dashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
                <div style={{ width: '100%', maxWidth: 480 }}>
                    <div style={{
                        background: '#fff',
                        padding: '60px 48px',
                        borderRadius: '48px',
                        boxShadow: 'var(--shadow-soft)',
                        border: '3px solid #F1F1F1',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            background: 'rgba(0, 166, 192, 0.15)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            transform: 'rotate(5deg)'
                        }}>
                            <Rocket size={44} color="#00A6C0" />
                        </div>

                        <h1 style={{ fontSize: 36, color: '#001F3F', marginBottom: 12 }}>Join the Fun!</h1>
                        <p style={{ color: '#888', marginBottom: 44, fontWeight: 600 }}>Over 12,000 kids are already learning!</p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Kid's Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: 52, height: 60, borderRadius: 20 }}
                                        placeholder="Little Genius"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 24, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Parent's Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                                    <input
                                        type="email"
                                        className="input-field"
                                        style={{ paddingLeft: 52, height: 60, borderRadius: 20 }}
                                        placeholder="parent@example.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 32, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Secret Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                                    <input
                                        type="password"
                                        className="input-field"
                                        style={{ paddingLeft: 52, height: 60, borderRadius: 20 }}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: 64, borderRadius: 20, fontSize: 18 }}>
                                {loading ? <Loader2 className="spin" size={24} /> : 'Create Account'}
                            </button>
                        </form>

                        <div style={{ marginTop: 40, textAlign: 'center', fontSize: 15, color: '#888', fontWeight: 600 }}>
                            Already have an account? <Link to="/login" style={{ color: '#00A6C0', fontWeight: 800, textDecoration: 'none' }}>Sign in here</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
