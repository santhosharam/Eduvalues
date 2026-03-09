import { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { getMyCertificates } from '../../services/certificateService'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Award, Download, ExternalLink, Loader } from 'lucide-react'

export default function Certificates() {
    const [certs, setCerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(null)

    useEffect(() => {
        getMyCertificates()
            .then(r => setCerts(r.data.certificates || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleDownload = async (cert) => {
        setDownloading(cert._id)
        try {
            const response = await api.get(`/certificates/download/${cert._id}`, {
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `certificate-${cert.uniqueCode}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success('Certificate downloaded!')
        } catch {
            toast.error('Failed to download certificate')
        } finally {
            setDownloading(null)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '40px 16px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: 32, marginBottom: 8 }}>My Certificates</h1>
                <p style={{ color: '#64748b', marginBottom: 40, fontSize: 14 }}>
                    Your achievements — download and share proudly
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>Loading...</div>
                ) : certs.length === 0 ? (
                    <div className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
                        <Award size={52} color="#334155" style={{ marginBottom: 16 }} />
                        <h3 style={{ marginBottom: 8 }}>No certificates yet</h3>
                        <p style={{ color: '#64748b', fontSize: 14 }}>
                            Complete a course to earn your first certificate!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {certs.map(cert => (
                            <div key={cert._id} className="glass-card"
                                style={{ padding: 28, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(245,158,11,0.07))' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Award size={26} color="white" />
                                    </div>
                                    <span className="badge badge-success">Verified</span>
                                </div>
                                <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4 }}>
                                    {cert.course?.title}
                                </h3>
                                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                                    Issued: {new Date(cert.issuedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p style={{ fontSize: 11, color: '#475569', marginBottom: 20, fontFamily: 'monospace', letterSpacing: 1 }}>
                                    ID: {cert.uniqueCode}
                                </p>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => handleDownload(cert)} className="btn-primary"
                                        disabled={downloading === cert._id}
                                        style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '9px' }}>
                                        {downloading === cert._id
                                            ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                                            : <><Download size={13} /> Download PDF</>}
                                    </button>
                                    <a href={`/verify/${cert.uniqueCode}`} target="_blank" rel="noreferrer"
                                        className="btn-secondary"
                                        style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '9px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <ExternalLink size={13} /> Verify
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
