import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { markLessonComplete } from '../../services/progressService'
import api from '../../services/api'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { CheckCircle, FileText, Video, ArrowLeft } from 'lucide-react'

export default function LessonPage() {
    const { lessonId } = useParams()
    const [lesson, setLesson] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(`/lessons/${lessonId}`)
            .then(r => setLesson(r.data.lesson))
            .catch(() => toast.error('Could not load lesson'))
            .finally(() => setLoading(false))
    }, [lessonId])

    const handleComplete = async () => {
        if (!lesson?.course) return
        try {
            const res = await markLessonComplete(lesson.course, lessonId)
            setCompleted(true)
            toast.success(`Lesson complete! Course progress: ${res.data.percent}%`)
            if (res.data.percent === 100) {
                toast.success('🎉 Course completed! Your certificate is ready.', { duration: 5000 })
            }
        } catch {
            toast.error('Failed to update progress')
        }
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    if (!lesson) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#64748b' }}>Lesson not found.</p>
            <Link to="/dashboard/my-courses" className="btn-secondary">← Back to My Courses</Link>
        </div>
    )

    // Sanitize lesson HTML content to prevent XSS
    const safeContent = lesson.content
        ? DOMPurify.sanitize(lesson.content, { USE_PROFILES: { html: true } })
        : null

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '32px 16px', maxWidth: 860, margin: '0 auto', width: '100%' }}>

                {/* Breadcrumb */}
                <Link to="/dashboard/my-courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', textDecoration: 'none', fontSize: 13, marginBottom: 20 }}>
                    <ArrowLeft size={14} /> Back to My Courses
                </Link>

                <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 8, lineHeight: 1.3 }}>{lesson.title}</h1>
                {lesson.description && (
                    <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14, lineHeight: 1.7 }}>{lesson.description}</p>
                )}

                {/* Video */}
                {lesson.videoUrl && (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 14, overflow: 'hidden', marginBottom: 28, background: '#000' }}>
                        <iframe
                            src={lesson.videoUrl}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                {/* Sanitized Text Content */}
                {safeContent && (
                    <div className="glass-card"
                        style={{ padding: '28px 28px', marginBottom: 28, lineHeight: 1.85, color: '#94a3b8', fontSize: 15 }}
                        dangerouslySetInnerHTML={{ __html: safeContent }}
                    />
                )}

                {/* Resources */}
                {lesson.resources?.length > 0 && (
                    <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
                        <h3 style={{ marginBottom: 16, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={15} color="#6366f1" /> Downloadable Resources
                        </h3>
                        {lesson.resources.map((r, i) => (
                            <a key={i} href={r.url} download
                                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6366f1', textDecoration: 'none', fontSize: 14, marginBottom: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}>
                                <FileText size={14} /> {r.name}
                            </a>
                        ))}
                    </div>
                )}

                {/* Mark Complete */}
                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={completed ? 'btn-secondary' : 'btn-primary'}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                    {completed
                        ? <><CheckCircle size={16} /> Lesson Completed!</>
                        : '✓ Mark as Complete'}
                </button>
            </div>
        </div>
    )
}
