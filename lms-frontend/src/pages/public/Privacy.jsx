import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const SECTIONS = [
    {
        title: '1. Information We Collect',
        content: 'We collect information you provide directly such as your name, email address, and payment information when you register for an account or enroll in a course. We also automatically collect usage data and device information to improve our services.'
    },
    {
        title: '2. How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send transactional and promotional communications, and comply with legal obligations.'
    },
    {
        title: '3. Data Security',
        content: 'We implement industry-standard security measures including SSL encryption, bcrypt password hashing, and JWT-based authentication to protect your personal information. Payment data is processed securely through Razorpay and is never stored on our servers.'
    },
    {
        title: '4. Cookies',
        content: 'We use local storage to maintain your session and authentication state. We do not use third-party tracking cookies for advertising purposes.'
    },
    {
        title: '5. Data Sharing',
        content: 'We do not sell, trade, or rent your personal information to third parties. We may share limited information with our payment processor (Razorpay) solely for completing transactions.'
    },
    {
        title: '6. Your Rights',
        content: 'You have the right to access, correct, and delete your personal data. Contact us at support@learnhub.in to exercise these rights.'
    },
    {
        title: '7. Changes to This Policy',
        content: 'We may update this policy from time to time. We will notify you of significant changes by posting a notice on our website.'
    },
]

export default function Privacy() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '60px 16px 80px', width: '100%' }}>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 8 }}>Privacy Policy</h1>
                <p style={{ color: '#64748b', marginBottom: 40, fontSize: 14 }}>Last updated: March 2026</p>

                <div className="glass-card" style={{ padding: '28px 28px', marginBottom: 24 }}>
                    <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8 }}>
                        LearnHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our learning management platform.
                    </p>
                </div>

                {SECTIONS.map((s, i) => (
                    <div key={i} style={{ marginBottom: 28 }}>
                        <h2 style={{ fontSize: 18, marginBottom: 12, color: '#f1f5f9' }}>{s.title}</h2>
                        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.85 }}>{s.content}</p>
                    </div>
                ))}

                <div className="glass-card" style={{ padding: '20px 24px', marginTop: 40, borderLeft: '3px solid #6366f1' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>
                        Questions? Contact us at <a href="mailto:support@learnhub.in" style={{ color: '#818cf8' }}>support@learnhub.in</a>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
