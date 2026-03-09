import { Link } from 'react-router-dom'
import {
    Facebook, Instagram, Twitter, Linkedin,
    MapPin, Mail, Phone, Smile, Compass,
    Star, Heart, Sparkles
} from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{ background: '#F4F7F9', borderTop: '2px solid #F1F1F1', position: 'relative' }}>
            {/* Wave top */}
            <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '50px' }}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V95.8C59.71,118.43,147.3,126,221.33,113.36,275.64,104,303,80.89,321.39,56.44Z" fill="#fff"></path>
                </svg>
            </div>

            <div className="section-container" style={{ padding: '60px 24px 40px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr',
                    gap: 60,
                    alignItems: 'start'
                }} className="footer-grid">

                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <img
                                src="/logo.png"
                                alt="VE Value Education"
                                style={{ height: '44px', width: 'auto' }}
                            />
                        </Link>
                        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                            Empowering young minds through playful learning, ethical values, and creative exploration. Join our community today!
                        </p>
                        <div style={{ display: 'flex', gap: 14 }}>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: 20, marginBottom: 24, color: '#001F3F' }}>Explore</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {['Insights', 'Our Courses', 'Testimonials', 'Contact Us'].map(l => (
                                <Link key={l} to={l === 'Insights' ? '/blog' : '/'} style={{ color: '#666', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>{l}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Fun Stuff */}
                    <div>
                        <h2 style={{ fontSize: 20, marginBottom: 24, color: '#00A6C0' }}>Fun Corner</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ fontSize: 15, color: '#666', fontWeight: 600 }}>
                                Free Puzzles
                            </div>
                            <div style={{ fontSize: 15, color: '#666', fontWeight: 600 }}>
                                Daily Ethics
                            </div>
                            <div style={{ fontSize: 15, color: '#666', fontWeight: 600 }}>
                                Arts & Crafts
                            </div>
                        </div>
                    </div>

                    {/* Subscribe */}
                    <div>
                        <h4 style={{ fontSize: 20, marginBottom: 24, color: '#001F3F' }}>Parent Newsletter</h4>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Get tips on ethical parenting and creative learning.</p>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Your email here..."
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '40px',
                                    border: '2px solid #F1F1F1',
                                    outline: 'none',
                                    fontFamily: 'Quicksand',
                                    fontSize: '14px'
                                }}
                            />
                            <button style={{
                                position: 'absolute',
                                right: 6,
                                top: 6,
                                height: 44,
                                padding: '0 20px',
                                background: '#00A6C0',
                                border: 'none',
                                borderRadius: '30px',
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: 12
                            }}>
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '2px solid #F1F1F1', marginTop: 40, paddingTop: 20, textAlign: 'center', fontSize: 13, color: '#999' }}>
                    © {new Date().getFullYear()} VE Value Education. Made with ❤️ for the next generation.
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 30 }}>
                        <Link to="/" style={{ color: '#999' }}>Privacy Policy</Link>
                        <Link to="/" style={{ color: '#999' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>

            <style>{`
                 @media (max-width: 900px) {
                    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
                }
                @media (max-width: 600px) {
                    .footer-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </footer>
    )
}
