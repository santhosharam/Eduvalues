import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Shield, Lock, Eye, Database, Globe, UserCheck, Mail } from 'lucide-react'

const SECTIONS = [
    {
        icon: Database,
        title: 'Information We Collect',
        content: 'We collect information you provide directly such as your name, email address, and profile details when you register for an account or enroll in a course. We also automatically collect device information, IP addresses, and interaction data to optimize your learning experience.'
    },
    {
        icon: UserCheck,
        title: 'How We Use Your Data',
        content: 'Your information is used to personalize your curriculum, process secure payments, track your lesson progress, and issue verified certificates. We also use aggregated data to improve our educational content and platform stability.'
    },
    {
        icon: Lock,
        title: 'Security Infrastructure',
        content: 'We implement enterprise-grade security protocols, including AES-256 encryption for data at rest and TLS for data in transit. Our authentication is powered by Supabase/BCrypt, ensuring your credentials are never stored in plain text.'
    },
    {
        icon: Globe,
        title: 'Data Sharing & Third Parties',
        content: 'EduValues does not sell or rent your personal data. We only share essential information with trusted partners like Razorpay (for payments) and Supabase (for infrastructure). All partners are strictly vetted for GDPR/CCPA compliance.'
    },
    {
        icon: Shield,
        title: 'Your Privacy Rights',
        content: 'You maintain full ownership of your data. You have the right to request access to your information, correct inaccuracies, or request permanent deletion of your account and associated records by contacting our privacy team.'
    },
    {
        icon: Eye,
        title: 'Cookies and Tracking',
        content: 'We use essential functional cookies and local storage to maintain your educational session. We do not use third-party tracking pixels or intrusive marketing cookies that follow you across the web.'
    },
]

export default function Privacy() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section style={{
                padding: '80px 24px 100px',
                textAlign: 'center',
                background: '#001F3F',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(0, 166, 192, 0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(29, 209, 161, 0.15)', borderRadius: '50%' }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        color: '#00A6C0',
                        fontWeight: 800,
                        fontSize: '14px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '16px'
                    }}>Legal Guard</span>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, marginBottom: '24px' }}>Privacy Policy</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>
                        Discover how we protect your information and maintain the highest standards of data integrity.
                    </p>
                </div>

                {/* Signature Torn Paper Divider */}
                <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 11 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: '100%', height: '50px' }}>
                        <defs>
                            <filter id="torn-paper-edge-privacy">
                                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="8" result="noise" seed="30" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <rect x="-50" y="70" width="1300" height="100" fill="#F4F7F9" filter="url(#torn-paper-edge-privacy)" />
                    </svg>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <main className="section-container" style={{ padding: '80px 24px', flex: 1 }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #F1F1F1' }}>
                        <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '0' }}>
                            Last updated: <strong>March 31, 2026</strong>. <br />
                            At EduValues, your trust is our most valuable asset. We are committed to being transparent about how we handle your data and ensuring your privacy is never compromised.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                        {SECTIONS.map((s, i) => (
                            <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #F1F1F1', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '48px', height: '48px', background: '#00A6C015', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A6C0', marginBottom: '20px' }}>
                                    <s.icon size={24} />
                                </div>
                                <h2 style={{ fontSize: '20px', color: '#001F3F', fontWeight: 800, marginBottom: '12px' }}>{s.title}</h2>
                                <p style={{ color: '#666', fontSize: '14.5px', lineHeight: 1.7 }}>{s.content}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#00A6C0', padding: '40px', borderRadius: '32px', color: '#fff', marginTop: '60px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0, 166, 192, 0.2)' }}>
                        <Mail style={{ margin: '0 auto 16px' }} size={40} />
                        <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Contact our Privacy Team</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px', fontSize: '16px' }}>
                            If you have any questions or concern about our privacy practices, please reach out to us at:
                        </p>
                        <a href="mailto:privacy@eduvalues.in" style={{ color: '#fff', fontWeight: 900, fontSize: '20px', textDecoration: 'none', borderBottom: '2px solid rgba(255,255,255,0.3)' }}>
                            privacy@eduvalues.in
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
