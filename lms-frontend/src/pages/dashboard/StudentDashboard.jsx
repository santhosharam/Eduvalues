import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProgressBar from '../../components/course/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { getMyEnrollments } from '../../services/enrollmentService'
import { getMyCertificates } from '../../services/certificateService'
import {
    BookOpen, Award, TrendingUp, Clock, ArrowRight,
    PlayCircle, Trophy, Activity, MessageCircle,
    Rocket, Sparkles, Brain, Smile, Flame
} from 'lucide-react'

export default function StudentDashboard() {
    const { user } = useAuth()
    const [enrollments, setEnrollments] = useState([])
    const [certs, setCerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getMyEnrollments().then(r => setEnrollments(r.data.enrollments || [])).catch(() => { }),
            getMyCertificates().then(r => setCerts(r.data.certificates || [])).catch(() => { })
        ]).finally(() => setLoading(false))
    }, [])

    const inProgress = enrollments.filter(e => !e.isCompleted)
    const completed = enrollments.filter(e => e.isCompleted)

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '60px 24px 100px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

                {/* Greeting Row - Updated to Teal/Navy */}
                <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0, 166, 192, 0.15)', color: '#00A6C0', padding: '10px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: 800, marginBottom: 16 }}>
                            <Smile size={18} /> WELCOME BACK, EXPLORER!
                        </div>
                        <h1 style={{ fontSize: 44, fontWeight: 'bold', color: '#001F3F', marginBottom: 8 }}>
                            Hi, <span style={{ color: '#00A6C0' }}>{user?.name?.split(' ')[0]}</span>!
                        </h1>
                        <p style={{ color: '#888', fontSize: 18, fontWeight: 600 }}>Ready to unlock your next achievement today?</p>
                    </div>

                    {/* Streak Counter (Playful) */}
                    <div style={{ background: '#fff', padding: '16px 28px', borderRadius: '24px', border: '3px solid #F1F1F1', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-soft)' }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(255, 159, 67, 0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Flame size={24} color="#FF9F43" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: 24 }}>3 Days</div>
                            <div style={{ fontSize: 12, color: '#888', fontWeight: 700 }}>Learning Streak!</div>
                        </div>
                    </div>
                </div>

                {/* Stats Playground - Updated Icons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 64 }}>
                    {[
                        { icon: Rocket, label: 'Adventures Joined', val: enrollments.length, color: '#001F3F', bg: 'rgba(0, 31, 63, 0.1)' },
                        { icon: Activity, label: 'Currently Playing', val: inProgress.length, color: '#00A6C0', bg: 'rgba(0, 166, 192, 0.1)' },
                        { icon: Trophy, label: 'Completed Missions', val: completed.length, color: '#1DD1A1', bg: 'rgba(29, 209, 161, 0.1)' },
                        { icon: Award, label: 'Golden Badges', val: certs.length, color: '#FF9F43', bg: 'rgba(255, 159, 67, 0.1)' },
                    ].map(({ icon: Icon, label, val, color, bg }) => (
                        <div key={label} style={{ background: '#fff', padding: 32, borderRadius: '32px', border: '3px solid #F1F1F1', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: 72, height: 72, background: bg, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transform: 'rotate(-5deg)' }}>
                                <Icon size={32} color={color} />
                            </div>
                            <div style={{ fontSize: 40, fontWeight: 900, color: '#333' }}>{val}</div>
                            <p style={{ fontSize: 13, color: '#888', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{label}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60, alignItems: 'start' }} className="d-grid">

                    {/* Left Playground: Active Learning */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <h2 style={{ fontSize: 32, color: '#001F3F' }}>Resume Adventure</h2>
                            <Link to="/dashboard/my-courses" style={{ color: '#00A6C0', textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>
                                See All <ArrowRight size={20} style={{ marginLeft: 6 }} />
                            </Link>
                        </div>

                        {inProgress.length === 0 ? (
                            <div style={{ background: '#fff', borderRadius: '40px', padding: 80, textAlign: 'center', border: '3px solid #F1F1F1' }}>
                                <div style={{ fontSize: 80, marginBottom: 24 }}>🎨</div>
                                <h3 style={{ fontSize: 24, marginBottom: 12 }}>Your palette is empty!</h3>
                                <p style={{ color: '#888', marginBottom: 32, maxWidth: 340, margin: '0 auto 32px' }}>Start a new adventure today and build your character!</p>
                                <Link to="/courses" className="btn-primary" style={{ padding: '16px 48px' }}>Explore Courses</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {inProgress.map(e => (
                                    <div key={e.id} style={{ background: '#fff', padding: 32, borderRadius: '40px', border: '2px solid #F1F1F1', display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 32, alignItems: 'center' }}>
                                        <div style={{ height: 100, borderRadius: '20px', overflow: 'hidden' }}>
                                            <img src={e.course?.thumbnail || `https://picsum.photos/seed/${e.course?.id}/300/200`} alt={e.course?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 20, fontWeight: 800, color: '#333', marginBottom: 16 }}>{e.course?.title}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                                <div style={{ flex: 1, height: 12, background: '#F1F1F1', borderRadius: 6, overflow: 'hidden' }}>
                                                    <div style={{ width: `${e.progress || 0}%`, height: '100%', background: 'linear-gradient(90deg, #001F3F, #00A6C0)', borderRadius: 6 }} />
                                                </div>
                                                <span style={{ fontSize: 15, fontWeight: 800, color: '#00A6C0' }}>{e.progress || 0}%</span>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/dashboard/lesson/${e.lastWatched || (e.course?.lessons?.[0]?.id || e.course?.lessons?.[0])}`} 
                                            className="btn-primary" 
                                            style={{ borderRadius: 16, height: 54, padding: '0 32px' }}
                                        >
                                            Resume <PlayCircle size={20} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Playground: Sidebar Achievements */}
                    <aside>
                        <div style={{ background: '#fff', padding: 48, borderRadius: '48px', border: '3px solid #F1F1F1', textAlign: 'center', boxShadow: 'var(--shadow-soft)', marginBottom: 40 }}>
                            <div style={{
                                width: 120,
                                height: 120,
                                background: '#F4F7F9',
                                borderRadius: '40%',
                                margin: '0 auto 24px',
                                border: '6px solid #fff',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Avatar" />
                            </div>
                            <h3 style={{ fontSize: 24, color: '#001F3F', marginBottom: 6 }}>{user?.name}</h3>
                            <p style={{ fontSize: 14, color: '#888', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 32 }}>Explorer Level 4</p>
                            <Link to="/contact" className="btn-outline" style={{ width: '100%', borderRadius: 20 }}>
                                <MessageCircle size={18} /> Call Teacher
                            </Link>
                        </div>

                        {/* Recent Badges */}
                        {certs.length > 0 && (
                            <div style={{ background: '#001F3F', padding: 40, borderRadius: '48px', color: '#fff' }}>
                                <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Sparkles size={20} color="#00A6C0" /> Recent Badges
                                </h4>
                                <div style={{ display: 'grid', gap: 16 }}>
                                    {certs.slice(0, 2).map(cert => (
                                        <div key={cert._id} style={{ background: 'rgba(255,255,255,0.08)', padding: 20, borderRadius: '24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <Award size={32} color="#00A6C0" />
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 800 }}>{cert.course?.title}</div>
                                                <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Earned Yesterday</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            <Footer />

            <style>{`
                @media (max-width: 1000px) {
                    .d-grid { grid-template-columns: 1fr !important; }
                    aside { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
                }
                @media (max-width: 600px) {
                    aside { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    )
}
