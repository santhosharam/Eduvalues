import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Fix: Pass email and password accurately based on context definition
            const user = await login(formData.email, formData.password);

            if (user.role !== 'admin') {
                toast.error('Access Denied. Administrator privileges required.');
                // Optional: log them out automatically if they aren't admin but tried this portal
                navigate('/');
                return;
            }

            toast.success('Admin authentication successful.');
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050A14' }}>
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
                <div style={{ width: '100%', maxWidth: 440 }}>
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(32px)',
                        padding: '60px 48px',
                        borderRadius: '48px',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            background: 'rgba(0, 166, 192, 0.1)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            border: '1px solid rgba(0, 166, 192, 0.2)'
                        }}>
                            <ShieldAlert size={40} color="#00A6C0" />
                        </div>

                        <h1 style={{ fontSize: 32, color: '#fff', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>System Portal</h1>
                        <p style={{ color: '#64748b', marginBottom: 44, fontWeight: 600 }}>Authorized personnel only.</p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Administrator Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                                    <input
                                        type="email"
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px 16px 52px',
                                            background: 'rgba(5, 10, 20, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '16px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        placeholder="admin@domain.com"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        onFocus={e => e.currentTarget.style.borderColor = '#00A6C0'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 32, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Secure Key</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
                                    <input
                                        type="password"
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px 16px 52px',
                                            background: 'rgba(5, 10, 20, 0.5)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '16px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        onFocus={e => e.currentTarget.style.borderColor = '#00A6C0'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: '#00A6C0',
                                    border: 'none',
                                    borderRadius: '16px',
                                    color: '#fff',
                                    fontWeight: 900,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 12,
                                    boxShadow: '0 10px 20px rgba(0, 166, 192, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 166, 192, 0.3)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 166, 192, 0.2)'; }}
                            >
                                {loading ? <Loader2 className="spin" size={20} /> : <><LogIn size={20} /> Authenticate Session</>}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
