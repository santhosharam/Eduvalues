import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Award, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function CertificateVerify() {
    const { code } = useParams()
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/certificates/verify/${code}`)
            .then(r => setResult(r.data))
            .catch(err => setResult({ valid: false, message: err.response?.data?.message || 'Certificate not found' }))
            .finally(() => setLoading(false))
    }, [code])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
                    {loading ? (
                        <div style={{ color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
                            <p>Verifying certificate...</p>
                        </div>
                    ) : result?.valid ? (
                        <div className="glass-card" style={{ padding: 48, background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))' }}>
                            <div style={{ width: 72, height: 72, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CheckCircle size={36} color="#10b981" />
                            </div>
                            <span className="badge badge-success" style={{ fontSize: 12, marginBottom: 20, display: 'inline-flex' }}>
                                ✓ Certificate Verified
                            </span>
                            <h1 style={{ fontSize: 26, marginBottom: 8 }}>{result.certificate?.student?.name}</h1>
                            <p style={{ color: '#94a3b8', marginBottom: 4, fontSize: 14 }}>has successfully completed</p>
                            <h2 style={{ fontSize: 20, color: '#6366f1', marginBottom: 20, lineHeight: 1.4 }}>
                                {result.certificate?.course?.title}
                            </h2>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
                                <div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Instructor</div>
                                    <div style={{ fontSize: 14, color: '#f1f5f9' }}>{result.certificate?.course?.instructor || '—'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Issued On</div>
                                    <div style={{ fontSize: 14, color: '#f1f5f9' }}>
                                        {new Date(result.certificate?.issuedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Code</div>
                                    <div style={{ fontSize: 14, color: '#f1f5f9', fontFamily: 'monospace' }}>{code}</div>
                                </div>
                            </div>
                            <div style={{ padding: '12px 20px', background: 'rgba(16,185,129,0.08)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, color: '#34d399' }}>
                                This certificate is authentic and was issued by LearnHub.
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: 48, background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(99,102,241,0.05))' }}>
                            <div style={{ width: 72, height: 72, background: 'rgba(239,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <XCircle size={36} color="#f87171" />
                            </div>
                            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Certificate Not Found</h2>
                            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                                No certificate with code <code style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 4 }}>{code}</code> was found. The code may be incorrect or the certificate may have been revoked.
                            </p>
                            <Link to="/" className="btn-secondary">Back to Home</Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
