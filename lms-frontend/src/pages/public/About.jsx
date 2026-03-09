import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Target, Eye, Heart } from 'lucide-react'

export default function About() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '80px 24px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', marginBottom: 16 }}>About <span className="gradient-text">LearnHub</span></h1>
                    <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>
                        We believe education should be accessible to everyone. Our platform connects passionate learners with world-class instructors.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 64 }}>
                    {[
                        { icon: Target, title: 'Our Mission', desc: 'To democratize education by providing high-quality, affordable online learning to students worldwide.' },
                        { icon: Eye, title: 'Our Vision', desc: 'A world where anyone, anywhere can access the skills they need to thrive in the digital economy.' },
                        { icon: Heart, title: 'Our Values', desc: 'Excellence, inclusivity, curiosity, and a genuine commitment to student success drive everything we do.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
                            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(14,165,233,0.2))', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <Icon size={24} color="#6366f1" />
                            </div>
                            <h3 style={{ marginBottom: 12 }}>{title}</h3>
                            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Team placeholder */}
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: 16 }}>Built for Learners, by Learners</h2>
                    <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
                        Our team of educators and engineers work tirelessly to build the best possible learning experience for every student on the platform.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
