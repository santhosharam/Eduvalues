import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/auth/forgot-password', { email })
            setSent(true)
            toast.success('Reset instructions sent!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 24, background: 'linear-gradient(135deg,#6366f1,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LearnHub</span>
                    </Link>
                </div>

                {sent ? (
                    <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
                        <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={30} color="#10b981" />
                        </div>
                        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Check your email</h2>
                        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                            If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                        </p>
                        <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Back to Login</Link>
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: 32 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Forgot Password</h2>
                        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                            Enter your email and we'll send you a reset link.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 8 }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                                    <input className="input-field" style={{ paddingLeft: 42 }} type="email" placeholder="you@example.com"
                                        value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 13 }} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
