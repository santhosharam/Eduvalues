import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'

const TERMS = [
    {
        title: '1. Acceptance of Terms',
        content: 'By accessing and using LearnHub, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.'
    },
    {
        title: '2. Account Registration',
        content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your password. You must notify us immediately of any unauthorized use of your account.'
    },
    {
        title: '3. Course Enrollment and Payment',
        content: 'Course prices are displayed in Indian Rupees (INR). Payment is processed securely via Razorpay. Upon successful payment, you will be automatically enrolled and granted lifetime access to the course content.'
    },
    {
        title: '4. Refund Policy',
        content: 'We offer a 30-day money-back guarantee for paid courses. If you are not satisfied with a course, contact support@learnhub.in within 30 days of purchase for a full refund, provided you have not completed more than 25% of the course.'
    },
    {
        title: '5. Intellectual Property',
        content: 'All course content, including videos, text, PDFs, and quizzes, is the intellectual property of LearnHub or its instructors. You may not reproduce, distribute, or sell any course content without express written permission.'
    },
    {
        title: '6. Certificates',
        content: 'Certificates of completion are issued digitally upon completing 100% of a course. Each certificate has a unique verification code and can be verified publicly at learnhub.in/verify.'
    },
    {
        title: '7. Prohibited Conduct',
        content: 'You agree not to share your account credentials, resell course access, upload harmful content, or attempt to circumvent our security measures. Violations may result in account termination without refund.'
    },
    {
        title: '8. Limitation of Liability',
        content: 'LearnHub is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the relevant course.'
    },
    {
        title: '9. Changes to Terms',
        content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.'
    },
]

export default function Terms() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, maxWidth: 800, margin: '0 auto', padding: '60px 16px 80px', width: '100%' }}>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 8 }}>Terms of Service</h1>
                <p style={{ color: '#64748b', marginBottom: 40, fontSize: 14 }}>Last updated: March 2026</p>

                <div className="glass-card" style={{ padding: '24px 28px', marginBottom: 32 }}>
                    <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8 }}>
                        Welcome to LearnHub. These Terms of Service govern your use of our online learning platform. Please read them carefully before using our services.
                    </p>
                </div>

                {TERMS.map((s, i) => (
                    <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h2 style={{ fontSize: 17, marginBottom: 10, color: '#f1f5f9' }}>{s.title}</h2>
                        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.85 }}>{s.content}</p>
                    </div>
                ))}

                <div className="glass-card" style={{ padding: '20px 24px', marginTop: 20, borderLeft: '3px solid #6366f1' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>
                        For questions about these Terms, contact us at{' '}
                        <a href="mailto:support@learnhub.in" style={{ color: '#818cf8' }}>support@learnhub.in</a>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
