import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { useState } from 'react'
import { Send, CheckCircle, Pencil, Star, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1200))
        setSent(true)
        setLoading(false)
        toast.success('Thank you! We have received your message.')
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
            <Navbar />

            {/* --- UPPER HERO SECTION --- */}
            <section style={{
                padding: '100px 24px 140px',
                textAlign: 'center',
                background: '#FCF8F1', // Light cream background
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Floating Decorative Elements */}
                <div style={{ position: 'absolute', top: '15%', left: '10%', transform: 'rotate(-20deg)', opacity: 0.8 }}>
                    <Pencil size={48} color="#FF9F43" strokeWidth={1.5} />
                </div>
                <div style={{ position: 'absolute', top: '10%', left: '25%', opacity: 0.6 }}>
                    <Sparkles size={32} color="#1DD1A1" />
                </div>
                <div style={{ position: 'absolute', top: '20%', right: '15%', opacity: 0.7 }}>
                    <Star size={40} color="#FF9F43" fill="#FF9F43" />
                </div>

                <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        color: '#1DD1A1',
                        fontWeight: 800,
                        fontSize: '14px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '16px'
                    }}>Online Classes</span>

                    <h1 style={{
                        fontSize: 'clamp(32px, 6vw, 64px)',
                        color: '#001F3F',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        Educating Students For Success In <br /> A Changing World.
                    </h1>
                </div>

                {/* Wave Divider at Bottom */}
                <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '100px' }}>
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#fff"></path>
                    </svg>
                </div>
            </section>

            {/* --- CONTACT FORM SECTION --- */}
            <section style={{ padding: '80px 24px 120px', background: '#fff' }}>
                <div className="section-container contact-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                    gap: '80px',
                    alignItems: 'center'
                }}>

                    {/* Left side: Overlapping Images */}
                    <div style={{ position: 'relative', height: '540px' }} className="image-stack">
                        {/* Decorative Circle Background */}
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '5%',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            border: '15px solid rgba(0, 31, 63, 0.05)',
                            zIndex: 0
                        }} />

                        {/* Top Left Image */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '80%',
                            height: '320px',
                            borderRadius: '40px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                            zIndex: 2,
                            border: '10px solid #fff'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80"
                                alt="Kids Learning"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Bottom Right Image */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '75%',
                            height: '300px',
                            borderRadius: '40px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                            zIndex: 3,
                            border: '10px solid #fff'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"
                                alt="Single Kid Learning"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Right side: Contact Form */}
                    <div>
                        <span style={{
                            color: '#FF9F43',
                            fontWeight: 800,
                            fontSize: '14px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: '12px'
                        }}>Contact Us</span>

                        <h2 style={{
                            fontSize: '52px',
                            color: '#001F3F',
                            fontWeight: 900,
                            marginBottom: '24px',
                            lineHeight: 1.2
                        }}>Our Education Partners</h2>

                        <p style={{ color: '#888', marginBottom: '40px', fontSize: 16, lineHeight: 1.7 }}>
                            We are always looking for passionate educators and institutions to join our mission.
                            Send us a message and we will get back to you shortly.
                        </p>

                        {sent ? (
                            <div style={{
                                background: '#FCF8F1',
                                padding: '48px',
                                borderRadius: '40px',
                                textAlign: 'center',
                                border: '3px dashed #1DD1A1'
                            }}>
                                <CheckCircle size={64} color="#1DD1A1" style={{ marginBottom: 24 }} />
                                <h3 style={{ fontSize: 28, color: '#001F3F' }}>Message Sent!</h3>
                                <p style={{ color: '#888', marginTop: 12 }}>We'll reach out to your provided email within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        style={inputStyle}
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Id"
                                        style={inputStyle}
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    style={inputStyle}
                                    required
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                />
                                <textarea
                                    placeholder="Message"
                                    style={{ ...inputStyle, height: '180px', padding: '24px', resize: 'none' }}
                                    required
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                                <button type="submit" disabled={loading} style={{
                                    background: '#FF9F43',
                                    color: '#fff',
                                    padding: '20px 48px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    fontWeight: 900,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    width: 'fit-content',
                                    boxShadow: '0 10px 20px rgba(255, 159, 67, 0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    {loading ? 'Sending...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
                    .image-stack { height: 400px !important; }
                    h1 { font-size: 38px !important; }
                    h2 { font-size: 34px !important; }
                }
            `}</style>
        </div>
    )
}

const inputStyle = {
    width: '100%',
    padding: '18px 24px',
    background: '#FCF8F1', // Light beige for inputs
    border: 'none',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#001F3F',
    fontFamily: 'Quicksand, sans-serif',
    outline: 'none'
}
