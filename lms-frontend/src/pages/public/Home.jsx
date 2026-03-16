import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import CourseCard from '../../components/course/CourseCard'
import { getAllCourses } from '../../services/courseService'
import {
    BookOpen, Users, Star, Brain, Palmtree,
    Rocket, GraduationCap, Play, ChevronRight,
    Smile, Heart, MessageCircle, Trophy, Quote,
    Monitor, UserCheck, Shield, Globe, MessageSquare, Box
} from 'lucide-react'

// --- Testimonials Data ---
const TESTIMONIALS = [
    {
        name: 'Peter Owt',
        child: 'Emmi',
        text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        bgColor: '#FFF0EB',
        borderColor: '#FFD8CC',
        quoteColor: '#FFB08E'
    },
    {
        name: 'Del Phineum',
        child: 'Lee',
        text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        bgColor: '#EBF5FF',
        borderColor: '#CCEAFF',
        quoteColor: '#80C4FF'
    },
    {
        name: 'Wiley Waites',
        child: 'Norma',
        text: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        bgColor: '#FFF9EB',
        borderColor: '#FFF0CC',
        quoteColor: '#F2D388'
    }
]

// --- Features Section Data ---
const FEATURES = [
    { title: 'Online Classes', desc: 'Learn Anytime, Anywhere Online', icon: Monitor },
    { title: 'Expert Instructor', desc: 'Guidance from Industry Experts', icon: UserCheck },
    { title: 'Easy Communication', desc: 'Seamless Student-Teacher Interaction', icon: MessageSquare },
    { title: 'Easy To Use', desc: 'Simple, Fast, User-Friendly', icon: Smile },
    { title: 'Character Building', desc: 'Develop integrity, honesty, and compassion.', icon: Shield },
    { title: 'Critical Thinking', desc: 'Learn to analyze dilemmas and make ethical decisions.', icon: Brain },
    { title: 'Social Responsibility', desc: 'Commit to community service and social justice.', icon: Users },
    { title: 'Global Citizenship', desc: 'Embrace diversity and promote peace worldwide.', icon: Globe },
]

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1472162072142-d544e73eebfb?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1489914169085-9b54fdd8f2a2?auto=format&fit=crop&w=1920&q=80"
]

export default function Home() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        setLoading(true)
        getAllCourses({ limit: 4 })
            .then(res => setCourses(res.data.courses || []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false))
    }, [])

    // Carousel auto-scroll logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div style={{ background: '#fff' }}>
            <Navbar />

            {/* ══ HERO SECTION ═══════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: '#001F3F',
            }}>
                {/* Carousel Background Images */}
                {HERO_IMAGES.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `linear-gradient(rgba(0, 31, 63, 0.7), rgba(0, 31, 63, 0.4)), url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentSlide === idx ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out',
                            zIndex: 1
                        }}
                    />
                ))}

                <div className="section-container" style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '100px 24px',
                    width: '100%'
                }}>
                    <div style={{ maxWidth: '800px' }}>

                        <h1 style={{
                            fontSize: 'clamp(48px, 8vw, 84px)',
                            fontWeight: '900',
                            fontFamily: '"Fredoka", sans-serif',
                            lineHeight: 1.1,
                            marginBottom: '32px',
                            color: '#fff',
                            textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}>
                            Empowering <br />
                            <span style={{ color: '#00A6C0' }}>Bright Futures</span>
                        </h1>
                        <p style={{
                            fontSize: '22px',
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.9)',
                            marginBottom: '48px',
                            maxWidth: '640px',
                            fontWeight: 600,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            VE Value Education provides a transformative learning experience for the next generation.
                            Nurturing integrity, creativity, and leadership through interactive playgrounds.
                        </p>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            <Link to="/courses" className="btn-primary" style={{ height: 64, padding: '0 48px', fontSize: 20, boxShadow: '0 15px 30px rgba(0, 166, 192, 0.4)' }}>
                                Start Adventure <Play size={20} fill="#fff" />
                            </Link>
                            <Link to="/blog" className="btn-outline" style={{ height: 64, padding: '0 48px', fontSize: 20, color: '#fff', borderColor: '#fff' }}>
                                <Heart size={20} /> Our Insights
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div style={{
                    position: 'absolute',
                    bottom: '80px', // Moved up to prevent touching the torn paper
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 12,
                    zIndex: 10
                }}>
                    {HERO_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{
                                width: currentSlide === idx ? 40 : 12,
                                height: 12,
                                borderRadius: 6,
                                background: currentSlide === idx ? '#00A6C0' : 'rgba(255,255,255,0.3)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Torn Paper Divider */}
                <div style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 11 }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: '100%', height: '100px' }}>
                        <defs>
                            <filter id="torn-paper-edge">
                                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="8" result="noise" seed="10" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <rect x="-50" y="70" width="1300" height="100" fill="#fff" filter="url(#torn-paper-edge)" />
                    </svg>
                </div>
            </section>

            {/* ══ FEATURES SECTION (FORMERLY PLAYGROUNDS) ═════════ */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{
                            fontSize: 'clamp(32px, 5vw, 56px)',
                            fontWeight: '900',
                            color: '#001F3F',
                            fontFamily: '"Fredoka", sans-serif',
                            marginBottom: '16px'
                        }}>
                            Why Value Education?
                        </h2>
                        <p style={{
                            fontSize: '18px',
                            color: '#666',
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontWeight: 500,
                            lineHeight: 1.6
                        }}>
                            Building a foundation of integrity, critical thinking, and global awareness through modern, accessible learning.
                        </p>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '24px'
                    }}>
                        {FEATURES.map((item, idx) => (
                            <div key={idx} style={{
                                background: '#fff',
                                padding: '48px 24px',
                                borderRadius: '24px',
                                border: '1px solid #f0f0f0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                cursor: 'default'
                            }}
                                className="feature-card"
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.05)'
                                    e.currentTarget.style.borderColor = '#6366f130'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                    e.currentTarget.style.borderColor = '#f0f0f0'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#f3f0ff',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    color: '#6366f1'
                                }}>
                                    <item.icon size={36} />
                                </div>
                                <h3 style={{
                                    fontWeight: 800,
                                    fontSize: '20px',
                                    color: '#000',
                                    marginBottom: '16px',
                                    fontFamily: 'inherit'
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#666',
                                    lineHeight: 1.6,
                                    maxWidth: '220px'
                                }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ OUR COURSES ═══════════════════════════════════════ */}
            <section style={{ background: '#F4F7F9', padding: '40px 24px', position: 'relative' }}>
                {/* Wave divider at top */}
                <div style={{ position: 'absolute', top: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)' }}>
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '50px' }}>
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#fff"></path>
                    </svg>
                </div>

                <div className="section-container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '56px',
                        flexWrap: 'wrap',
                        gap: 20
                    }}>
                        <div>
                            <h2 style={{ fontSize: '52px', color: '#001F3F' }}>Fun Courses</h2>
                            <p style={{ color: '#888', fontSize: 18, marginTop: 8 }}>Hand-crafted learning journeys for little geniuses.</p>
                        </div>
                        <Link to="/courses" className="btn-outline" style={{ borderRadius: 16 }}>
                            All Lessons <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '32px'
                    }}>
                        {loading ? (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
                                <Smile className="spin" size={60} color="#00A6C0" />
                                <p style={{ marginTop: 20, color: '#001F3F', fontWeight: 700 }}>Finding adventures...</p>
                            </div>
                        ) : courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ LATEST BLOG SECTION ═══════════════════════════════ */}
            <section style={{ padding: '40px 24px', background: '#fff' }}>
                <div className="section-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '64px', flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <h2 style={{ fontSize: '52px', color: '#001F3F' }}>Latest Insights</h2>
                            <p style={{ color: '#888', fontSize: 18, marginTop: 8 }}>Discover stories, tips, and strategies from our educators.</p>
                        </div>
                        <Link to="/blog" style={{ color: '#00A6C0', textDecoration: 'none', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            Visit Blog <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                        {[
                            {
                                title: "What are the easy dance form to learn for beginners?",
                                cat: "Dance",
                                img: "https://images.unsplash.com/photo-1508700115892-45ecd0562c3e?auto=format&fit=crop&w=800&q=80",
                                date: "Oct 8, 2021"
                            },
                            {
                                title: "Most essential UX design principle for new comers.",
                                cat: "UX/UI Design",
                                img: "https://images.unsplash.com/photo-1541462608141-ad4d14207907?auto=format&fit=crop&w=800&q=80",
                                date: "Oct 8, 2021"
                            },
                            {
                                title: "10 most easy steps to master chord progression in guitar.",
                                cat: "Music",
                                img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
                                date: "Oct 8, 2021"
                            }
                        ].map((post, i) => (
                            <Link key={i} to="/blog" style={{ textDecoration: 'none' }} className="blog-card-home">
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    border: '1px solid #F1F1F1',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{ height: '220px', overflow: 'hidden' }}>
                                        <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '28px' }}>
                                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                            <span style={{ fontSize: 10, fontWeight: 900, color: '#00A6C0', textTransform: 'uppercase', letterSpacing: 1 }}>{post.cat}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: '#999' }}>• {post.date}</span>
                                        </div>
                                        <h3 style={{ fontSize: '20px', color: '#001F3F', fontWeight: 800, lineHeight: 1.4, height: '56px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {post.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS SECTION ═════════════════════════════════ */}
            <section style={{ padding: '40px 24px', background: '#fff' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <div style={{ color: '#FFB08E', fontWeight: 700, letterSpacing: 2, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', fontFamily: '"Quicksand", sans-serif' }}>PARENTS TESTIMONIAL</div>
                    <h2 style={{ fontSize: '56px', fontWeight: 900, color: '#001F3F', marginBottom: '80px', fontFamily: '"Fredoka", sans-serif' }}>Happy Parents</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px'
                    }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Bubble */}
                                <div style={{
                                    backgroundColor: t.bgColor,
                                    padding: '40px',
                                    borderRadius: '40px',
                                    border: `3px dashed ${t.borderColor}`,
                                    position: 'relative',
                                    marginBottom: '30px',
                                    textAlign: 'center'
                                }}>
                                    {/* Quote Marks - Top Left */}
                                    <div style={{ position: 'absolute', top: -15, left: 30, backgroundColor: t.quoteColor, padding: 8, borderRadius: 10, color: '#fff' }}>
                                        <Quote size={20} fill="#fff" />
                                    </div>

                                    <p style={{ fontStyle: 'italic', color: '#555', lineHeight: 1.8, fontSize: 16, fontWeight: 500 }}>
                                        "{t.text}"
                                    </p>

                                    {/* Quote Marks - Bottom Right */}
                                    <div style={{ position: 'absolute', bottom: -15, right: 30, backgroundColor: t.quoteColor, padding: 8, borderRadius: 10, color: '#fff' }}>
                                        <Quote size={20} fill="#fff" transform="rotate(180)" />
                                    </div>

                                    {/* Speech Bubble Tail - Using SVG for realism */}
                                    <div style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', width: 40, height: 20 }}>
                                        <svg viewBox="0 0 40 20" style={{ fill: t.bgColor, width: '100%', height: '100%' }}>
                                            <path d="M0,0 L40,0 L20,20 Z" />
                                            {/* Dashed outline for tail */}
                                            <path d="M0,0 L20,20 L40,0" fill="none" stroke={t.borderColor} strokeWidth="3" strokeDasharray="6,4" />
                                        </svg>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', paddingLeft: 10 }}>
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: 18, color: '#001F3F' }}>{t.name}</div>
                                        <div style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>Parent of {t.child}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION ═══════════════════════════════════════ */}
            <section style={{ padding: '60px 24px' }}>
                <div className="section-container">
                    <div style={{
                        background: 'linear-gradient(135deg, #001F3F 0%, #00A6C0 100%)',
                        borderRadius: '40px',
                        padding: '80px 40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '40px',
                        boxShadow: '0 30px 60px rgba(0, 166, 192, 0.2)',
                        textAlign: 'center'
                    }}>
                        <div style={{ maxWidth: '640px', textAlign: 'left' }}>
                            <h2 style={{ fontSize: '62px', color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
                                Start Your Child's <br /> Magical Education!
                            </h2>
                            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Join thousands of families building a brighter future through play.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/register" style={{
                                background: '#fff',
                                color: '#001F3F',
                                padding: '24px 56px',
                                borderRadius: '60px',
                                textDecoration: 'none',
                                fontWeight: 800,
                                fontSize: '20px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 0 rgba(0,0,0,0.05)'
                            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                Get Started <Rocket size={24} style={{ marginLeft: 10 }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            <Footer />

            <style>{`
                @media (max-width: 900px) {
                    .hero-content { text-align: center; }
                    .hero-content p { margin: 0 auto 40px !important; }
                    .hero-content div { justify-content: center; }
                    h2 { font-size: 42px !important; }
                }
            `}</style>
        </div>
    )
}
