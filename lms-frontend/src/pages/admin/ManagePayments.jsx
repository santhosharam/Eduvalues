import { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminTable from '../../components/admin/AdminTable';
import { TrendingUp, CreditCard, DollarSign, Calendar, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ManagePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/payments/all')
            .then(r => setPayments(r.data.payments || []))
            .catch(() => { /* Silence is golden */ })
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue = payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <AdminLayout
            title="Financial Audit"
            subtitle="Monitor all platform revenue streams and transaction histories."
        >
            {/* High-Level Financial Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div style={statBoxStyle('#1DD1A1')}>
                    <div style={iconBoxStyle('#1DD1A1')}><TrendingUp size={22} /></div>
                    <div>
                        <div style={statLabelStyle}>Aggregate Revenue</div>
                        <div style={statValueStyle}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div style={statBoxStyle('#00A6C0')}>
                    <div style={iconBoxStyle('#00A6C0')}><CreditCard size={22} /></div>
                    <div>
                        <div style={statLabelStyle}>Total Transactions</div>
                        <div style={statValueStyle}>{payments.length}</div>
                    </div>
                </div>
            </div>

            {/* Transactional Registry Grid */}
            <AdminTable
                headers={['Remitter', 'Pathways', 'Monetary Value', 'Settlement Status', 'Chronology']}
                loading={loading}
                data={payments}
                renderRow={(p) => (
                    <>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13, fontWeight: 800
                                }}>
                                    {p.student?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 13.5 }}>{p.student?.name || 'Anonymous Vendor'}</div>
                                    <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{p.student?.email}</div>
                                </div>
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.course?.title || 'Unknown Course Module'}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ fontSize: 16, color: '#1DD1A1', fontWeight: 900 }}>₹{(p.amount || 0).toLocaleString('en-IN')}</div>
                            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>Gate: {p.paymentMethod || 'Razorpay Core'}</div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                borderRadius: '10px',
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                background: p.status === 'success' ? 'rgba(29, 209, 161, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                                color: p.status === 'success' ? '#1DD1A1' : '#FF6B6B',
                                border: `1px solid ${p.status === 'success' ? 'rgba(29,209,161,0.2)' : 'rgba(255,107,107,0.2)'}`
                            }}>
                                {p.status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                {p.status}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12, fontWeight: 700 }}>
                                <Calendar size={14} />
                                {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending Sync'}
                            </div>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                            <button style={actionBtnStyle} title="Audit Detailed Logs"><ArrowUpRight size={16} /></button>
                        </td>
                    </>
                )}
            />
        </AdminLayout>
    );
}

const actionBtnStyle = {
    width: 40, height: 40, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
};

const statBoxStyle = (color) => ({
    background: 'rgba(10, 17, 32, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', gap: 20
});

const iconBoxStyle = (color) => ({
    width: 54, height: 54, background: color + '15', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, border: '1px solid ' + color + '33'
});

const statLabelStyle = { fontSize: 12, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 };
const statValueStyle = { fontSize: 28, fontWeight: 900, color: '#fff', marginTop: 4, fontFamily: 'Outfit, sans-serif' };
