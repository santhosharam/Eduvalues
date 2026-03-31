import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { FileText, Pencil, CreditCard, ShieldCheck, Award, MessageSquare, AlertCircle, Info } from 'lucide-react'

const TERMS = [
    {
        icon: ShieldCheck,
        title: 'Acceptance of Terms',
        content: 'By accessing and using EduValues, you accept and agree to be bound by the terms and provisions of this agreement. Use of our services constitutes full acceptance of these terms in their entirety.'
    },
    {
        icon: Pencil,
        title: 'Account Registration',
        content: 'Registration requires accurate and complete information. You are solely responsible for the confidentiality of your account credentials and any activity occurring under your account name.'
    },
    {
        icon: CreditCard,
        title: 'Payments & Course Access',
        content: 'Payments are processed securely via Razorpay in INR. Successful transaction grants you lifetime, non-transferable access to the course materials through our learning dashboard.'
    },
    {
        icon: Award,
        title: 'Intellectual Property',
        content: 'All educational content, videos, code samples, and textual materials are the exclusive property of EduValues. Unauthorized reproduction, distribution, or resale is strictly prohibited by law.'
    },
    {
        icon: AlertCircle,
        title: 'Termination Policy',
        content: 'EduValues reserves the right to terminate access to any user found engaging in fraudulent activity, harassment of other students, or systematic violation of our platform security.'
    },
    {
        icon: MessageSquare,
        title: 'Limitation of Liability',
        content: 'While we strive for 100% platform uptime and accuracy, EduValues is not liable for indirect or consequential damages arising from service interruptions or minor informational discrepancies.'
    },
]

export default function Terms() {
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
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '16px'
                    }}>Service Contract</span>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, marginBottom: '24px' }}>Terms of Service</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>
                        A comprehensive agreement detailing the relationship between EduValues and our community of learners.
                    </p>
                </div>

                {/* Signature Torn Paper Divider */}
                <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 11 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: '100%', height: '50px' }}>
                        <defs>
                            <filter id="torn-paper-edge-terms">
                                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="8" result="noise" seed="35" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <rect x="-50" y="70" width="1300" height="100" fill="#F4F7F9" filter="url(#torn-paper-edge-terms)" />
                    </svg>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <main className="section-container" style={{ padding: '80px 24px', flex: 1 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '60px', border: '1px solid #F1F1F1', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: '#FF9F4315', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F43', flexShrink: 0 }}>
                            <Info size={32} />
                        </div>
                        <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.8, marginBottom: '0' }}>
                            Last updated: <strong>March 31, 2026</strong>. <br />
                            These terms govern your access to and use of our website and services. Please read them carefully to understand your rights and obligations as a member of our learning playground.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                        {TERMS.map((s, i) => (
                            <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #F1F1F1', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '40px', height: '40px', color: '#00A6C0', marginBottom: '20px' }}>
                                    <s.icon size={28} />
                                </div>
                                <h3 style={{ fontSize: '18px', color: '#001F3F', fontWeight: 800, marginBottom: '12px' }}>{s.title}</h3>
                                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>{s.content}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '80px', padding: '48px', background: 'rgba(0, 31, 63, 0.02)', borderRadius: '40px', border: '2.5px dashed #001F3F20', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '24px', fontWeight: 900, color: '#001F3F', marginBottom: '16px' }}>Ready to start your adventure?</h4>
                        <p style={{ color: '#555', marginBottom: '32px', fontSize: '17px' }}>By continuing to use our platform, you acknowledge that you have read and agreed to these terms.</p>
                        <a href="/courses" style={{ 
                            background: 'linear-gradient(135deg, #001F3F 0%, #00A6C0 100%)', 
                            color: '#fff', 
                            padding: '16px 40px', 
                            borderRadius: '20px', 
                            fontWeight: 900, 
                            fontSize: '18px', 
                            textDecoration: 'none',
                            display: 'inline-block',
                            boxShadow: '0 15px 30px rgba(0, 31, 63, 0.2)'
                        }}>
                            Agree & Discover Lessons
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
