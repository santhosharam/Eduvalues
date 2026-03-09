import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function PaymentConfirmation() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="glass-card" style={{ padding: '60px 48px', textAlign: 'center', maxWidth: 500, width: '100%' }}>
                <div style={{ width: 72, height: 72, background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
                    <CheckCircle size={36} color="#10b981" />
                </div>
                <h1 style={{ fontSize: 28, marginBottom: 12 }}>Payment Successful!</h1>
                <p style={{ color: '#94a3b8', marginBottom: 32, lineHeight: 1.7 }}>
                    You're now enrolled in the course. Start learning right away!
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/dashboard/my-courses" className="btn-primary" style={{ fontSize: 14 }}>
                        Go to My Courses <ArrowRight size={14} />
                    </Link>
                    <Link to="/courses" className="btn-secondary" style={{ fontSize: 14 }}>Browse More</Link>
                </div>
            </div>
        </div>
    )
}
