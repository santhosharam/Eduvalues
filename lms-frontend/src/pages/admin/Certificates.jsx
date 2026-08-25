import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import { Award, User, BookOpen, ExternalLink, Download, ShieldCheck, Mail, Search } from 'lucide-react';

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const r = await api.get('/admin/certificates');
            setCertificates(r.data.certificates || []);
        } catch (err) { 
            console.error('[CERT_FETCH_ERROR]', err);
            toast.error(err.response?.data?.message || 'Failed to sync credential registry'); 
        }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCertificates(); }, []);

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const r = await api.get(`/certificates/verify/${verifyCode}`);
            toast.success('Certificate Authenticated: Verified ✅');
            setShowVerifyModal(false);
        } catch { toast.error('Invalid or Expired Certificate Code'); }
        finally { setVerifying(false); }
    };

    const handleDownloadCert = async (cert) => {
        try {
            toast.loading('Preparing PDF...', { id: 'admin-cert-dl' })
            const res = await api.get(`/certificates/download/${cert.id}`, { responseType: 'blob' })
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const name = cert.user?.name || 'Student'
            link.setAttribute('download', `Certificate_${name.replace(/\s+/g, '_')}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success('Certificate downloaded successfully!', { id: 'admin-cert-dl' })
        } catch (err) {
            console.error('[ADMIN_CERT_DOWNLOAD_ERROR]', err)
            toast.error('Failed to download certificate', { id: 'admin-cert-dl' })
        }
    }

    const handleEmailCert = async (cert) => {
        try {
            toast.loading('Sending certificate email...', { id: 'admin-cert-email' })
            const res = await api.post(`/certificates/email/${cert.id}`)
            if (res.data?.success) {
                toast.success(res.data.message || 'Email dispatched successfully!', { id: 'admin-cert-email' })
            } else {
                toast.error('Failed to send email', { id: 'admin-cert-email' })
            }
        } catch (err) {
            console.error('[ADMIN_CERT_EMAIL_ERROR]', err)
            toast.error(err.response?.data?.message || 'Failed to send certificate email', { id: 'admin-cert-email' })
        }
    }

    const handleSearch = (e) => setSearchTerm(e.target.value);

    // Dynamic filtering for certificates list
    const filteredCertificates = certificates.filter(c =>
        c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout
            title="Credential Authority"
            subtitle="Manage, verify, and monitor all issued digital credentials in the ecosystem."
        >
            {/* Action Command Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
                    <Search
                        size={18}
                        color="#475569"
                        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by student, email, course, or code..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={searchFieldStyle}
                    />
                </div>

                <button
                    onClick={() => setShowVerifyModal(true)}
                    style={{
                        background: 'rgba(29, 209, 161, 0.15)',
                        color: '#1DD1A1',
                        padding: '14px 28px',
                        borderRadius: '16px',
                        border: '1px solid rgba(29, 209, 161, 0.2)',
                        fontWeight: 900,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29, 209, 161, 0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(29, 209, 161, 0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <ShieldCheck size={18} /> Verify Credential
                </button>
            </div>

            {/* Issued Credentials Registry Grid */}
            <AdminTable
                headers={['Metadata', 'Pathways', 'Issued Context', 'Verification Code', 'Actions']}
                loading={loading}
                data={filteredCertificates}
                renderRow={(cert) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    background: 'linear-gradient(135deg, #00A6C0, #001F3F)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 900
                                }}>
                                    {cert.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{cert.user?.name || 'Student'}</div>
                                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{cert.user?.email || 'N/A'}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>
                                <BookOpen size={14} color="#00A6C0" />
                                {cert.courses?.title}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{new Date(cert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div style={{ fontSize: 10, color: '#1DD1A1', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>Auth Status: SECURE</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <code style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                color: '#00A6C0',
                                fontSize: 11,
                                fontWeight: 800,
                                fontFamily: 'monospace, Courier New'
                            }}>
                                {cert.code}
                            </code>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <a 
                                    href={`/verify/${cert.code}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    style={actionBtnStyle} 
                                    title="View Public Verification"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button onClick={() => handleEmailCert(cert)} style={actionBtnStyle} title="Resend Notification"><Mail size={16} /></button>
                                <button onClick={() => handleDownloadCert(cert)} style={actionBtnStyle} title="Download PDF"><Download size={16} /></button>
                            </div>
                        </td>
                    </>
                )}
            />

            {/* Credential Verification Modal */}
            <AdminModal
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
                title="Verify System Credential"
                subtitle="Enter a certificate unique ID to validate its authenticity in our database."
                width={500}
                type="info"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Certificate Unique Identifier</label>
                        <input
                            type="text"
                            placeholder="e.g. CERT-2026-XXXX"
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            style={modalInputFieldStyle}
                        />
                    </div>
                    <button
                        onClick={handleVerify}
                        disabled={verifying || !verifyCode}
                        style={verifyBtnStyle}
                    >
                        {verifying ? 'Authenticating Registry...' : 'Initiate Verification'}
                    </button>
                </div>
            </AdminModal>
        </AdminLayout>
    );
}

const actionBtnStyle = {
    width: 40, height: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
};

const searchFieldStyle = {
    width: '100%', padding: '14px 20px 14px 48px', background: 'rgba(5, 10, 20, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px',
    color: '#fff', fontSize: '14px', fontWeight: 600, outline: 'none', transition: 'all 0.2s'
};

const modalInputFieldStyle = {
    width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
    color: '#fff', fontSize: '15px', fontWeight: 600, outline: 'none', fontFamily: 'Outfit, sans-serif'
};

const verifyBtnStyle = {
    padding: '16px', background: '#00A6C0', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: 900, fontSize: 15, cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 166, 192, 0.2)', transition: 'all 0.2s'
};
