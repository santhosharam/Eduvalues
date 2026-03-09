import { Link } from 'react-router-dom'
import { Home, BookOpen, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)' }}>
            <div style={{ textAlign: 'center', maxWidth: 500 }}>
                {/* 404 number */}
                <div style={{ fontSize: 'clamp(80px, 20vw, 140px)', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
                    404
                </div>

                <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 12 }}>Page Not Found</h1>
                <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 36, maxWidth: 380, margin: '0 auto 36px' }}>
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn-primary" style={{ fontSize: 14 }}>
                        <Home size={15} /> Go to Home
                    </Link>
                    <Link to="/courses" className="btn-secondary" style={{ fontSize: 14 }}>
                        <BookOpen size={15} /> Browse Courses
                    </Link>
                </div>

                <button onClick={() => window.history.back()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 24, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>
                    <ArrowLeft size={13} /> Go Back
                </button>
            </div>
        </div>
    )
}
