import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { getCourseBySlug } from '../../services/courseService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
    Clock, Users, BookOpen, Star,
    PlayCircle, CheckCircle, ChevronRight,
    Loader2, ArrowLeft, Trophy, Share2,
    Lock, Calendar, Globe, Rocket, Brain,
    Sparkles, Smile, Shield, Heart
} from 'lucide-react'

export default function CourseDetail() {
    const { slug } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        console.log('CourseDetail Fetching Slug:', slug)
        getCourseBySlug(slug)
            .then(res => {
                const c = res.data.course
                console.log('Course loaded:', c)
                console.log('Lessons array:', c?.lessons)
                setCourse(c)
            })
            .catch(() => setCourse(null))
            .finally(() => setLoading(false))
    }, [slug])

    // Safely extract the first lesson ID regardless of shape:
    // - Supabase: lessons = [{ id: 'uuid', ... }]
    // - MongoDB:  lessons = [{ _id: 'objectid', ... }] or ['objectid-string']
    const getFirstLessonId = (lessons) => {
        if (!lessons || lessons.length === 0) return null
        const first = lessons[0]
        if (typeof first === 'string') return first          // plain ID string
        return first.id || first._id || null                // full object
    }

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
            <Smile className="spin" size={64} color="#00A6C0" />
        </div>
    )

    if (!course) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
                <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 40, border: '2px solid #F1F1F1' }}>
                    <h2 style={{ fontSize: 32, marginBottom: 16 }}>Adventure Not Found!</h2>
                    <p style={{ color: '#888', marginBottom: 32 }}>We couldn't find the course you're looking for.</p>
                    <Link to="/courses" className="btn-primary">Back to Playgrounds</Link>
                </div>
            </div>
            <Footer />
        </div>
    )

    const isEnrolled = user?.enrolledCourses?.some(c => (c.id || c._id) === (course.id || course._id)) || user?.role === 'admin'

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <Navbar />

            {/* --- Banner - Updated to Navy/Teal --- */}
            <section style={{
                background: '#001F3F',
                color: '#fff',
                padding: '80px 24px 100px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements - Updated to Teal */}
                <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(0, 166, 192, 0.25)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, background: 'rgba(29, 209, 161, 0.15)', borderRadius: '50%' }} />

                <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) 400px', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div>
                        <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 15, textDecoration: 'none', marginBottom: 24, fontWeight: 'bold' }}>
                            <ArrowLeft size={18} /> Back to Search
                        </Link>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                            <span style={{ background: '#00A6C0', color: '#fff', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {course.category || 'PLAYFUL LEARNING'}
                            </span>
                            <span style={{ background: '#FF9F43', color: '#fff', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                {course.level || 'KIDS'}
                            </span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 'bold', marginBottom: 24, color: '#fff', lineHeight: 1.1 }}>{course.title}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 640, fontWeight: 600 }}>{course.description}</p>

                        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Star size={20} color="#00A6C0" fill="#00A6C0" />
                                <span style={{ fontWeight: 800, fontSize: 18 }}>4.9</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>(1.2k+ reviews)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 700 }}>
                                <Users size={20} color="#00A6C0" /> 2.5k Enrolled
                            </div>
                        </div>

                        {getFirstLessonId(course.lessons) ? (
                            <Link
                                to={`/dashboard/lesson/${getFirstLessonId(course.lessons)}`}
                                className="btn-primary" style={{ height: 64, padding: '0 48px', fontSize: 18, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                            >
                                🚀 Start Learning!
                            </Link>
                        ) : (
                            <button
                                onClick={() => toast.error('Lessons not loaded yet. Please refresh the page.')}
                                className="btn-primary" 
                                style={{ height: 64, padding: '0 48px', fontSize: 18, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                            >
                                Start Course
                            </button>
                        )}
                    </div>

                    {/* Preview Image Frame */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div style={{
                            borderRadius: '40% 60% 70% 30% / 50% 50% 50% 50%',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
                            border: '8px solid rgba(255,255,255,0.1)',
                            position: 'relative',
                            height: 340,
                            background: '#F1F1F1'
                        }}>
                            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="btn-primary" style={{ height: 64, width: 64, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                                    <PlayCircle size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </section>

            {/* --- Content Grid --- */}
            <main className="section-container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 60, padding: '80px 24px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 64 }}>
                        <h2 style={{ fontSize: 32, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Brain size={32} color="#00A6C0" /> Why This Course?
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                            {[
                                { t: 'Develop integrity & moral reasoning', i: Shield, c: '#1DD1A1' },
                                { t: 'Critical Thinking with fun stories', i: Brain, c: '#FF9F43' },
                                { t: 'Empathy & social awareness', i: Heart, c: '#00A6C0' },
                                { t: 'Courage & creative expression', i: Sparkles, c: '#00D2D3' }
                            ].map(({ t, i: Icon, c }) => (
                                <div key={t} style={{ background: '#F4F7F9', padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={22} color={c} />
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#444' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Path */}
                    <div style={{ marginBottom: 64 }}>
                        <h2 style={{ fontSize: 32, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Rocket size={32} color="#FF9F43" /> Course Journey
                        </h2>
                        <div style={{ border: '3px solid #F4F7F9', borderRadius: '32px', overflow: 'hidden' }}>
                            {(course.lessons || []).length === 0 ? (
                                <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>
                                    No lessons added to this journey yet.
                                </div>
                            ) : course.lessons.map((lesson, idx) => (
                                <div key={lesson.id || lesson._id} style={{
                                    padding: '24px 32px',
                                    background: idx % 2 === 0 ? '#fff' : '#F4F7F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: idx !== course.lessons.length - 1 ? '3px solid #F4F7F9' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                                        <div style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '16px',
                                            background: '#001F3F',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 18,
                                            fontWeight: 800,
                                            boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 18, fontWeight: 800, color: '#2D3436' }}>Lesson {idx + 1} - {lesson.title}</div>
                                            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{lesson.description || 'Values Exploration'}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {lesson.isFree ? (
                                            <span style={{ background: '#1DD1A1', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: 11, fontWeight: 800 }}>FREE PREVIEW</span>
                                        ) : (
                                            <div style={{ width: 44, height: 44, background: '#F1F1F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Lock size={18} color="#999" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div style={{ marginBottom: 64 }}>
                        <h2 style={{ fontSize: 32, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Users size={32} color="#00A6C0" /> Student Reviews
                        </h2>
                        
                        {(course.reviews || []).length === 0 ? (
                            <div style={{ padding: '32px', background: '#F4F7F9', borderRadius: '32px', border: '2px solid #EEE' }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />)}
                                </div>
                                <p style={{ fontSize: 18, color: '#444', fontStyle: 'italic', lineHeight: 1.6 }}>
                                    "A wonderful course that helped my child understand kindness."
                                </p>
                                <div style={{ marginTop: 16, fontWeight: 700, color: '#888' }}>— Sarah M., Parent</div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {course.reviews.map(review => (
                                    <div key={review.id || review._id} style={{ padding: '32px', background: '#F4F7F9', borderRadius: '32px', border: '2px solid #EEE' }}>
                                        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={20} fill={i < review.rating ? "#F59E0B" : "none"} color="#F59E0B" />
                                            ))}
                                        </div>
                                        <p style={{ fontSize: 18, color: '#444', fontStyle: 'italic', lineHeight: 1.6 }}>
                                            "{review.comment}"
                                        </p>
                                        <div style={{ marginTop: 16, fontWeight: 700, color: '#888' }}>— {review.student?.name || 'Anonymous Student'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Card */}
                <aside>
                    <div style={{
                        background: '#fff',
                        padding: '40px 32px',
                        borderRadius: '40px',
                        border: '3px solid #F1F1F1',
                        position: 'sticky',
                        top: 120,
                        boxShadow: 'var(--shadow-soft)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: 56, fontWeight: 900, color: '#00A6C0', marginBottom: 12 }}>
                            ₹{course.discountPrice || course.price}
                        </div>
                        <p style={{ fontSize: 15, color: '#888', fontWeight: 600, marginBottom: 32 }}>Give your child the gift of values!</p>

                        {getFirstLessonId(course.lessons) ? (
                            <Link
                                to={`/dashboard/lesson/${getFirstLessonId(course.lessons)}`}
                                className="btn-primary"
                                style={{ width: '100%', height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                            >
                                🚀 Start Learning!
                            </Link>
                        ) : (
                            <button
                                onClick={() => toast.error('Lessons not loaded yet. Please refresh the page.')}
                                className="btn-primary"
                                style={{ width: '100%', height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                            >
                                Start Course
                            </button>
                        )}

                        <div style={{ marginTop: 40, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#2D3436' }}>This course includes:</h4>
                            {[
                                { text: 'Full lifetime access', icon: Sparkles },
                                { text: '10 Life-changing lessons', icon: Brain },
                                { text: 'Certificate of completion', icon: Trophy },
                                { text: 'Access on mobile and web', icon: PlayCircle }
                            ].map(({ text, icon: Icon }) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: '#555', fontWeight: 600 }}>
                                    <Icon size={18} color="#FF9F43" /> {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            <Footer />

            <style>{`
                @media (max-width: 1024px) {
                    main { grid-template-columns: 1fr !important; }
                    aside { position: static !important; margin-top: 40px; }
                    h1 { font-size: 36px !important; }
                }
            `}</style>
        </div>
    )
}
