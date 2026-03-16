import { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProgressBar from '../../components/course/ProgressBar'
import { getMyEnrollments } from '../../services/enrollmentService'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle } from 'lucide-react'

export default function MyCourses() {
    const [enrollments, setEnrollments] = useState([])
    const [tab, setTab] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMyEnrollments().then(r => setEnrollments(r.data.enrollments || [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = tab === 'all' ? enrollments : tab === 'completed' ? enrollments.filter(e => e.isCompleted) : enrollments.filter(e => !e.isCompleted)

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '40px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: 32, marginBottom: 8 }}>My Courses</h1>
                <p style={{ color: '#64748b', marginBottom: 32 }}>All your enrolled courses in one place</p>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                    {['all', 'inprogress', 'completed'].map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: tab === t ? '#6366f1' : 'rgba(255,255,255,0.05)', color: tab === t ? 'white' : '#94a3b8' }}>
                            {t === 'all' ? 'All' : t === 'inprogress' ? 'In Progress' : 'Completed'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>
                        <BookOpen size={40} color="#334155" style={{ marginBottom: 16 }} />
                        <p>No courses here. <Link to="/courses" style={{ color: '#6366f1' }}>Browse courses →</Link></p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.map(e => (
                            <div key={e._id} className="glass-card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                                <img src={e.course?.thumbnail || `https://picsum.photos/seed/${e.course?._id}/120/80`} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <h3 style={{ fontSize: 16 }}>{e.course?.title}</h3>
                                        {e.isCompleted && <span className="badge badge-success"><CheckCircle size={10} style={{ marginRight: 4 }} />Completed</span>}
                                    </div>
                                    <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>by {e.course?.instructor}</p>
                                    <ProgressBar percent={e.progress || 0} />
                                </div>
                                <Link 
                                    to={`/dashboard/lesson/${e.lastWatched || (e.course?.lessons?.[0]?._id || e.course?.lessons?.[0])}`} 
                                    className="btn-primary" 
                                    style={{ padding: '9px 20px', fontSize: 13, flexShrink: 0 }}
                                >
                                    {e.isCompleted ? 'Review' : 'Continue'}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}
