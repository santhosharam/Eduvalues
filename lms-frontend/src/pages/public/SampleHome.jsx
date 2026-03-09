import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { getAllCourses } from '../../services/courseService'
import {
    BookOpen, Users, Star, Brain, Palmtree,
    Rocket, GraduationCap, Play, ChevronRight
} from 'lucide-react'

// --- Playful Colors ---
const COLORS = {
    yellow: '#FFD200',
    purple: '#8E44AD',
    orange: '#FF9F43',
    cyan: '#00D2D3',
    green: '#1DD1A1',
    lightGray: '#F9F9F9'
}

const CATEGORIES = [
    { name: 'Elementary', icon: Brain, color: COLORS.purple },
    { name: 'Creative Arts', icon: Palmtree, color: COLORS.orange },
    { name: 'Science Kids', icon: Rocket, color: COLORS.cyan },
    { name: 'Values', icon: GraduationCap, color: COLORS.green },
]

export default function SampleHome() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllCourses({ limit: 4 })
            .then(res => setCourses(res.data.courses || []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div style={{
            fontFamily: '"Quicksand", sans-serif',
            background: '#fff',
            color: '#333'
        }}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section style={{
                position: 'relative',
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: COLORS.lightGray,
            }}>
                {/* Visual Blobs */}
                <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(255, 210, 0, 0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
                <div style={{ position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, background: 'rgba(142, 68, 173, 0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />

                <div className="section-container" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 40,
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <div>
                        <span style={{
                            background: COLORS.orange,
                            color: '#fff',
                            padding: '6px 16px',
                            borderRadius: '30px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            marginBottom: '20px'
                        }}>NEW ADVENTURES!</span>
                        <h1 style={{
                            fontSize: 'clamp(40px, 6vw, 72px)',
                            fontWeight: 'bold',
                            fontFamily: '"Fredoka", sans-serif',
                            lineHeight: 1,
                            marginBottom: '24px',
                            color: COLORS.purple
                        }}>
                            Play, Learn <br />
                            <span style={{ color: COLORS.yellow }}>& Grow Up!</span>
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            lineHeight: 1.6,
                            color: '#666',
                            marginBottom: '40px',
                            maxWidth: '500px'
                        }}>
                            Discover a magical world of learning where kids explore science, ethics, and creativity through interactive games and expert-led videos.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link to="/courses" style={{
                                background: COLORS.yellow,
                                color: '#111',
                                padding: '16px 32px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                View Courses <Play size={18} fill="#111" />
                            </Link>
                            <Link to="/register" style={{
                                background: '#fff',
                                border: `2px solid ${COLORS.purple}`,
                                color: COLORS.purple,
                                padding: '16px 32px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 'bold'
                            }}> Join Now </Link>
                        </div>
                    </div>

                    <div style={{ position: 'relative', textAlign: 'center' }}>
                        <div style={{
                            width: '450px',
                            height: '450px',
                            background: COLORS.purple,
                            borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
                            display: 'inline-block',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?fit=crop&w=600&q=80"
                                alt="Kids"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {/* Floating Badges */}
                        <div style={{ position: 'absolute', top: '10%', right: '5%', background: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', gap: '10px' }}>
                            <Star color={COLORS.yellow} fill={COLORS.yellow} />
                            <span style={{ fontWeight: 'bold' }}>4.9/5 Rating</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '10%', left: '5%', background: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', gap: '10px' }}>
                            <GraduationCap color={COLORS.green} />
                            <span style={{ fontWeight: 'bold' }}>10k+ Students</span>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '60px' }}>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126,221.33,113.36,275.64,104,303,80.89,321.39,56.44Z" fill="#fff"></path>
                    </svg>
                </div>
            </section>

            {/* --- CATEGORIES SECTION --- */}
            <section style={{ padding: '80px 24px' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: '"Fredoka", sans-serif',
                        fontSize: '48px',
                        color: COLORS.purple,
                        marginBottom: '16px'
                    }}>Popular Categories</h2>
                    <p style={{ color: '#888', marginBottom: '56px' }}>Explore courses specifically designed for young minds.</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px'
                    }}>
                        {CATEGORIES.map(cat => (
                            <div key={cat.name} style={{
                                background: '#fff',
                                padding: '32px',
                                borderRadius: '24px',
                                border: `2px solid ${cat.color}22`,
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: `${cat.color}15`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px'
                                }}>
                                    <cat.icon size={32} color={cat.color} />
                                </div>
                                <h4 style={{ fontWeight: 'bold', fontSize: '20px' }}>{cat.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- COURSES SECTION --- */}
            <section style={{ background: COLORS.lightGray, padding: '80px 24px' }}>
                <div className="section-container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '48px'
                    }}>
                        <h2 style={{
                            fontFamily: '"Fredoka", sans-serif',
                            fontSize: '48px',
                            color: COLORS.purple
                        }}>Awesome Courses</h2>
                        <Link to="/courses" style={{ color: COLORS.purple, textDecoration: 'none', fontWeight: 'bold' }}>All Courses <ChevronRight size={16} /></Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px'
                    }}>
                        {courses.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: '#999' }}>Loading courses...</p>
                            </div>
                        ) : courses.map(course => (
                            <div key={course._id} style={{
                                background: '#fff',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                border: '1px solid #eee',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <img
                                        src={course.thumbnail || `https://picsum.photos/seed/${course._id}/400/300`}
                                        alt={course.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: course.type === 'Onsite' ? COLORS.orange : COLORS.purple,
                                        color: '#fff',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        {course.type === 'Onsite' ? '🏢 Onsite' : '🌐 Online'}
                                    </span>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <h4 style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        marginBottom: '12px',
                                        lineHeight: 1.4,
                                        height: '50px',
                                        overflow: 'hidden'
                                    }}>{course.title}</h4>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex' }}>
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={COLORS.yellow} color={COLORS.yellow} />)}
                                        </div>
                                        <span style={{ fontSize: '13px', color: '#888' }}>(0 Reviews)</span>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '20px', color: COLORS.purple }}>
                                            {course.price === 0 ? 'FREE' : `₹${course.price}`}
                                        </span>
                                        <Link to={`/courses/${course.slug || course._id}`} style={{
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                            color: '#333',
                                            fontSize: '14px',
                                            border: '1px solid #333',
                                            padding: '8px 16px',
                                            borderRadius: '6px'
                                        }}>VIEW DETAILS</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- JOIN CTA SECTION --- */}
            <section style={{ padding: '80px 24px' }}>
                <div className="section-container">
                    <div style={{
                        background: COLORS.yellow,
                        borderRadius: '30px',
                        padding: '60px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '30px'
                    }}>
                        <div style={{ maxWidth: '600px' }}>
                            <h2 style={{
                                fontFamily: '"Fredoka", sans-serif',
                                fontSize: '48px',
                                marginBottom: '16px'
                            }}>Build Your Child's <br /> Future With Us</h2>
                            <p style={{ fontWeight: 600 }}>Join thousands of parents who trust our playful learning ecosystem.</p>
                        </div>
                        <Link to="/register" style={{
                            background: '#111',
                            color: '#fff',
                            padding: '20px 48px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}>Get Started Now</Link>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                .section-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 768px) {
                    .section-container {
                        grid-template-columns: 1fr !important;
                    }
                    h1 { font-size: 40px !important; }
                }
            `}</style>
        </div>
    )
}
