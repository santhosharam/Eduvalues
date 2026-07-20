import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import CourseCard from '../../components/course/CourseCard'
import { getAllCourses } from '../../services/courseService'
import {
    BookOpen, Users, Star, Brain, Palmtree,
    Rocket, GraduationCap, Play, ChevronRight,
    Smile, Heart, MessageCircle, Trophy, Quote,
    Monitor, UserCheck, Shield, Globe, MessageSquare, Box,
    Sparkles, Award, Compass, Gamepad2, Gift, Volume2
} from 'lucide-react'

// --- Testimonials Data ---
const TESTIMONIALS = [
    {
        name: 'Samantha K.',
        child: 'Joey (Age 5)',
        text: 'EduValues completely changed how Joey reacts to sharing! The story of the Kind Squirrel was his absolute favorite. I love the progress tracking!',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        bgColor: '#FFF0EB',
        borderColor: '#FFD8CC',
        quoteColor: '#FFB08E'
    },
    {
        name: 'David L.',
        child: 'Mia (Age 7)',
        text: 'Finally, screen time that I actually feel proud of! Mia actively wiggles her mascot and repeats the moral lessons during dinner. Incredible design!',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        bgColor: '#EBF5FF',
        borderColor: '#CCEAFF',
        quoteColor: '#80C4FF'
    },
    {
        name: 'Priyah R.',
        child: 'Arun (Age 6)',
        text: 'The wiggling buttons and magical journey map make Arun look forward to ethics class! It is beautifully optimized and extremely safe.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        bgColor: '#FFF9EB',
        borderColor: '#FFF0CC',
        quoteColor: '#F2D388'
    }
]

// --- Kids Value Journey Map Nodes ---
const JOURNEY_NODES = [
    { id: 1, name: 'Kindness Island', desc: 'Share & Help Others!', icon: Smile, status: 'unlocked', color: '#1DD1A1', bg: 'rgba(29, 209, 161, 0.15)' },
    { id: 2, name: 'Forest of Honesty', desc: 'Tell the Truth!', icon: Shield, status: 'unlocked', color: '#FF9F43', bg: 'rgba(255, 159, 67, 0.15)' },
    { id: 3, name: 'Mountain of Courage', desc: 'Try New Things!', icon: Rocket, status: 'locked', color: '#00D2D3', bg: 'rgba(0, 210, 211, 0.15)' },
    { id: 4, name: 'Castle of Wisdom', desc: 'Make Ethical Choices!', icon: Trophy, status: 'locked', color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.15)' }
]

// --- Features Section Data ---
const FEATURES = [
    { title: 'Interactive Playgrounds', desc: 'Ethics through fun animations and story cards.', icon: Monitor },
    { title: 'Mascot Companion', desc: 'Our wiggling bunny guides kids and tracks streaking.', icon: Smile },
    { title: 'Gamified Rewards', desc: 'Collect magic stars, achievements, and badges.', icon: Trophy },
    { title: 'Safe & Verified', desc: 'Ad-free, certified lessons, and parents dashboard.', icon: Shield }
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
    
    // --- Interactive Kids States ---
    const [bubbles, setBubbles] = useState([])
    const [confetti, setConfetti] = useState([])
    const [magicStars, setMagicStars] = useState(15)
    const [streak, setStreak] = useState(3)
    const [mascotMessage, setMascotMessage] = useState("Hi there! Click me to find a hidden magic star! 💫")
    const [wigglingMascot, setWigglingMascot] = useState(false)
    const [sparkleNode, setSparkleNode] = useState(null)

    useEffect(() => {
        setLoading(true)
        getAllCourses({ limit: 4 })
            .then(res => {
                setCourses(res.data.courses || [])
            })
            .catch(() => setCourses([]))
            .finally(() => setLoading(false))
    }, [])

    // Carousel auto-scroll
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    // Sparkle / Bubble trail frame ticker
    useEffect(() => {
        const interval = setInterval(() => {
            // Update bubbles
            setBubbles(prev => prev.map(b => ({
                ...b,
                x: b.x + b.speedX,
                y: b.y + b.speedY,
                size: b.size * 0.97
            })).filter(b => b.size > 2))

            // Update Confetti particles
            setConfetti(prev => prev.map(c => ({
                ...c,
                x: c.x + Math.cos(c.angle) * c.speed,
                y: c.y + Math.sin(c.angle) * c.speed + 2, // gravity
                speed: c.speed * 0.97,
                size: c.size - 0.2
            })).filter(c => c.size > 0))
        }, 30)
        return () => clearInterval(interval)
    }, [])

    // Spawn bubble trail on mouse move
    const handleMouseMove = (e) => {
        if (Math.random() > 0.25) return // Throttle
        const containerOffset = e.currentTarget.getBoundingClientRect()
        const newBubble = {
            id: Math.random(),
            x: e.clientX - containerOffset.left,
            y: e.clientY - containerOffset.top,
            size: Math.random() * 24 + 10,
            color: ['#FF9F43', '#00D2D3', '#FF6B6B', '#1DD1A1', '#FFD000'][Math.floor(Math.random() * 5)],
            speedX: (Math.random() - 0.5) * 2,
            speedY: -Math.random() * 2 - 1
        }
        setBubbles(prev => [...prev.slice(-30), newBubble])
    }

    // Trigger mascot star click
    const handleMascotClick = (e) => {
        setWigglingMascot(true)
        setMagicStars(prev => prev + 1)
        setStreak(prev => prev + 1)
        setMascotMessage("Yippee! You earned 1 Magic Star! Look at it sparkle! 🌟")
        
        // Trigger confetti burst
        const bounds = e.currentTarget.getBoundingClientRect()
        const newConfetti = Array.from({ length: 25 }).map(() => ({
            id: Math.random(),
            x: bounds.left + bounds.width / 2 + window.scrollX,
            y: bounds.top + bounds.height / 2 + window.scrollY,
            color: ['#FF9F43', '#00D2D3', '#FF6B6B', '#1DD1A1', '#FFD000'][Math.floor(Math.random() * 5)],
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 8 + 4,
            size: Math.random() * 10 + 6
        }))
        setConfetti(prev => [...prev, ...newConfetti])

        setTimeout(() => {
            setWigglingMascot(false)
        }, 600)
    }

    return (
        <div style={{ background: '#FFFDF9', overflowX: 'hidden', position: 'relative' }} onMouseMove={handleMouseMove}>
            <Navbar />

            {/* Render Sparkle Bubbles trail */}
            {bubbles.map(b => (
                <div key={b.id} style={{
                    position: 'absolute',
                    left: b.x,
                    top: b.y,
                    width: b.size,
                    height: b.size,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${b.color})`,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    opacity: 0.75,
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.2s'
                }} />
            ))}

            {/* Render Confetti */}
            {confetti.map(c => (
                <div key={c.id} style={{
                    position: 'absolute',
                    left: c.x,
                    top: c.y,
                    width: c.size,
                    height: c.size,
                    borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                    background: c.color,
                    pointerEvents: 'none',
                    zIndex: 9998,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transform: 'rotate(' + (c.x % 360) + 'deg)'
                }} />
            ))}

            {/* ══ HERO SECTION ═══════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #001F3F 0%, #00366F 100%)',
            }}>
                {/* Slow moving decorative background clouds */}
                <div className="animated-cloud-bg" />

                {/* Carousel Background Images */}
                {HERO_IMAGES.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `linear-gradient(to bottom, rgba(0, 31, 63, 0.65), rgba(0, 31, 63, 0.85)), url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentSlide === idx ? 1 : 0,
                            transition: 'opacity 2s ease-in-out',
                            zIndex: 1
                        }}
                    />
                ))}

                <div className="section-container" style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '80px 24px',
                    width: '100%'
                }}>
                    <div className="hero-text-wrapper" style={{ maxWidth: '820px' }}>
                        {/* Kid-Friendly Badge */}
                        <div className="wiggle-hover" style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: 12, 
                            background: 'rgba(29, 209, 161, 0.25)', 
                            backdropFilter: 'blur(12px)',
                            padding: '14px 28px', 
                            borderRadius: '50px',
                            marginBottom: '32px',
                            border: '2px solid rgba(29, 209, 161, 0.4)',
                            animation: 'pulse 3s infinite',
                            cursor: 'pointer'
                        }}>
                            <Rocket size={24} color="#1DD1A1" className="animate-float" />
                            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '900', letterSpacing: 1.5, fontFamily: '"Fredoka", sans-serif' }}>
                                THE PLAYGROUND IS OPEN!
                            </span>
                        </div>

                        <h1 className="hero-title animate-float" style={{
                            fontSize: 'clamp(44px, 7vw, 80px)',
                            fontWeight: '900',
                            fontFamily: '"Fredoka", sans-serif',
                            lineHeight: 1.1,
                            marginBottom: '32px',
                            color: '#fff',
                            textShadow: '0 8px 0 #001326, 0 15px 30px rgba(0,0,0,0.5)'
                        }}>
                            Where Little Minds <br />
                            <span style={{ background: 'linear-gradient(90deg, #FECA57, #FF9F43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.3))' }}>Grow Big Dreams!</span>
                        </h1>
                        
                        <p style={{
                            fontSize: '22px',
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.95)',
                            marginBottom: '48px',
                            maxWidth: '680px',
                            fontWeight: 600,
                            fontFamily: '"Quicksand", sans-serif',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            VE Value Education combines interactive storybooks, wiggling companions, and game-like playgrounds to nurture integrity, leadership, and emotional intelligence.
                        </p>

                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }} className="mobile-stack">
                            <Link to="/courses" 
                                style={{
                                    background: 'linear-gradient(135deg, #1dd1a1, #10ac84)',
                                    color: '#fff',
                                    padding: '20px 48px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 900,
                                    fontFamily: '"Fredoka", sans-serif',
                                    fontSize: '22px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 0 #0d8c6b, 0 15px 25px rgba(29, 209, 161, 0.4)',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                    top: 0
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.top = '-2px';
                                    e.currentTarget.style.boxShadow = '0 10px 0 #0d8c6b, 0 20px 30px rgba(29, 209, 161, 0.5)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.top = '0';
                                    e.currentTarget.style.boxShadow = '0 8px 0 #0d8c6b, 0 15px 25px rgba(29, 209, 161, 0.4)';
                                }}
                                onMouseDown={e => {
                                    e.currentTarget.style.top = '6px';
                                    e.currentTarget.style.boxShadow = '0 2px 0 #0d8c6b, 0 5px 10px rgba(29, 209, 161, 0.2)';
                                }}
                                onMouseUp={e => {
                                    e.currentTarget.style.top = '-2px';
                                    e.currentTarget.style.boxShadow = '0 10px 0 #0d8c6b, 0 20px 30px rgba(29, 209, 161, 0.5)';
                                }}
                            >
                                Start Adventure <Play size={24} fill="#fff" style={{ marginLeft: 12 }} />
                            </Link>

                            <Link to="/blog" 
                                style={{
                                    background: 'linear-gradient(135deg, #FFD000, #FFA800)',
                                    color: '#001F3F',
                                    padding: '20px 48px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontWeight: 900,
                                    fontFamily: '"Fredoka", sans-serif',
                                    fontSize: '22px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 0 #d48b00, 0 15px 25px rgba(255, 208, 0, 0.35)',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                    top: 0
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.top = '-2px';
                                    e.currentTarget.style.boxShadow = '0 10px 0 #d48b00, 0 20px 30px rgba(255, 208, 0, 0.45)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.top = '0';
                                    e.currentTarget.style.boxShadow = '0 8px 0 #d48b00, 0 15px 25px rgba(255, 208, 0, 0.35)';
                                }}
                                onMouseDown={e => {
                                    e.currentTarget.style.top = '6px';
                                    e.currentTarget.style.boxShadow = '0 2px 0 #d48b00, 0 5px 10px rgba(255, 208, 0, 0.2)';
                                }}
                                onMouseUp={e => {
                                    e.currentTarget.style.top = '-2px';
                                    e.currentTarget.style.boxShadow = '0 10px 0 #d48b00, 0 20px 30px rgba(255, 208, 0, 0.45)';
                                }}
                            >
                                <Sparkles size={24} fill="#001F3F" style={{ marginRight: 12 }} className="animate-float" /> Explore Classes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Kids Assets - Bubbly Cloud & Red Balloon */}
                <div style={{ position: 'absolute', top: '12%', right: '8%', zIndex: 3 }} className="animate-float floating-decor">
                    <div style={{ width: 150, height: 150, background: 'rgba(255, 255, 255, 0.12)', borderRadius: '50%', filter: 'blur(45px)', position: 'absolute', top: -30, left: -30 }} />
                    <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, fill: '#fff', filter: 'drop-shadow(0 8px 0 #d0e8f0)' }}>
                        <path d="M20 60 C20 50, 30 40, 40 45 C45 35, 60 30, 70 40 C80 40, 85 50, 80 60 C85 70, 70 80, 50 80 C30 80, 15 70, 20 60 Z" />
                    </svg>
                </div>
                <div style={{ position: 'absolute', bottom: '20%', left: '4%', zIndex: 3, animationDelay: '1.5s' }} className="animate-float floating-decor">
                    <div style={{ width: 100, height: 100, background: 'rgba(255, 107, 107, 0.2)', borderRadius: '50%', filter: 'blur(30px)', position: 'absolute', top: -15, left: -15 }} />
                    <svg viewBox="0 0 100 100" style={{ width: 80, height: 90, fill: '#FF6B6B', filter: 'drop-shadow(0 6px 0 #cc4b4b)' }}>
                        <ellipse cx="50" cy="45" rx="28" ry="36" />
                        <polygon points="50,81 46,86 54,86" />
                        <path d="M50,86 Q48,91 52,96" stroke="#fff" strokeWidth="2.5" fill="none" />
                    </svg>
                </div>

                {/* Floating Letters */}
                <div style={{ position: 'absolute', top: '25%', left: '50%', zIndex: 3, color: 'rgba(255,255,255,0.2)', fontSize: 72, fontWeight: 900, fontFamily: 'Fredoka', animation: 'float 6s infinite' }}>A</div>
                <div style={{ position: 'absolute', bottom: '30%', right: '40%', zIndex: 3, color: 'rgba(255,255,255,0.15)', fontSize: 90, fontWeight: 900, fontFamily: 'Fredoka', animation: 'float 8s infinite', animationDelay: '2s' }}>1 2 3</div>

                {/* Wave divider at bottom */}
                <div style={{ position: 'absolute', bottom: -5, left: 0, right: 0, zIndex: 4, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 1440 120" style={{ fill: '#FFFDF9', width: '100%', height: 'auto', display: 'block' }}>
                        <path d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </section>

            {/* ══ THE MAGICAL JOURNEY MAP ═══════════════════════════ */}
            <section style={{ padding: '80px 24px', background: '#FFFDF9', position: 'relative' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '64px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFF0EB', padding: '10px 24px', borderRadius: '40px', border: '2px solid #FFD8CC', marginBottom: 16 }}>
                            <Compass size={20} color="#FF9F43" className="animate-float" />
                            <span style={{ fontSize: 13, fontWeight: 900, color: '#FF9F43', fontFamily: 'Fredoka' }}>STAGE PROGRESS MAP</span>
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(32px, 5vw, 56px)',
                            fontWeight: '900',
                            color: '#001F3F',
                            fontFamily: '"Fredoka", sans-serif',
                            marginBottom: '16px'
                        }}>
                            My Magical Value Journey!
                        </h2>
                        <p style={{
                            fontSize: '18px',
                            color: '#666',
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontWeight: 600,
                            lineHeight: 1.6
                        }}>
                            Complete moral stages to unlock shiny badges and reach the Castle of Wisdom!
                        </p>
                    </div>

                    {/* Interactive Path Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '32px',
                        position: 'relative',
                        padding: '40px 0'
                    }} className="journey-map-grid">
                        {/* Connecting dotted SVG road background for large screens */}
                        <div style={{
                            position: 'absolute',
                            top: '45%',
                            left: '5%',
                            right: '5%',
                            height: '6px',
                            background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #00A6C0 10px, #00A6C0 20px)',
                            zIndex: 1
                        }} className="desktop-only" />

                        {JOURNEY_NODES.map((node, idx) => {
                            const IconComponent = node.icon
                            return (
                                <div
                                    key={node.id}
                                    className="kids-card wiggle-hover"
                                    style={{
                                        background: '#fff',
                                        padding: '40px 24px',
                                        borderRadius: '32px',
                                        border: sparkleNode === node.id ? `4px solid ${node.color}` : '3px solid #F1F1F1',
                                        boxShadow: sparkleNode === node.id ? `0 15px 0 ${node.color}` : '0 10px 0 #F1F1F1',
                                        position: 'relative',
                                        zIndex: 2,
                                        cursor: 'pointer',
                                        top: sparkleNode === node.id ? -8 : 0,
                                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                    onClick={() => {
                                        setSparkleNode(node.id)
                                        setTimeout(() => setSparkleNode(null), 1000)
                                    }}
                                >
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: node.bg,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        color: node.color,
                                        boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.08), 0 8px 15px ${node.bg}`
                                    }}>
                                        <IconComponent size={36} className="animate-float" style={{ animationDuration: '3.5s' }} />
                                    </div>

                                    <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: 8, color: '#001F3F' }}>
                                        {node.name}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#666', fontWeight: 600, marginBottom: 16 }}>
                                        {node.desc}
                                    </p>

                                    <div style={{
                                        display: 'inline-flex',
                                        padding: '6px 14px',
                                        borderRadius: '30px',
                                        fontSize: '11px',
                                        fontWeight: 900,
                                        color: '#fff',
                                        background: node.status === 'unlocked' ? '#1DD1A1' : '#b2bec3',
                                        boxShadow: node.status === 'unlocked' ? '0 3px 0 #10ac84' : '0 3px 0 #636e72',
                                        fontFamily: 'Fredoka'
                                    }}>
                                        {node.status === 'unlocked' ? '🏆 UNLOCKED' : '🔒 STAGE LOCKED'}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══ PLAYGROUND INTERACTIVE FEATURES ═══════════════════ */}
            <section style={{ padding: '60px 24px', background: '#F4F7F9', position: 'relative' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{
                            fontSize: 'clamp(32px, 5vw, 56px)',
                            fontWeight: '900',
                            color: '#001F3F',
                            fontFamily: '"Fredoka", sans-serif',
                            marginBottom: '16px'
                        }}>
                            Magical Features Built for Kids!
                        </h2>
                        <p style={{
                            fontSize: '18px',
                            color: '#666',
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontWeight: 600,
                            lineHeight: 1.6
                        }}>
                            We replace corporate bullet-points with visual cartoon cards that kids can easily explore!
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '32px'
                    }}>
                        {FEATURES.map((item, idx) => (
                            <div key={idx} style={{
                                background: '#fff',
                                padding: '48px 24px',
                                borderRadius: '30px',
                                border: '3px solid #f0f0f0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                boxShadow: '0 8px 0 #f0f0f0',
                                position: 'relative',
                                top: 0
                            }}
                                className="feature-card wiggle-hover"
                                onMouseEnter={e => {
                                    e.currentTarget.style.top = '-8px'
                                    e.currentTarget.style.boxShadow = '0 16px 0 rgba(0, 166, 192, 0.15), 0 20px 30px rgba(0, 166, 192, 0.1)'
                                    e.currentTarget.style.borderColor = '#00A6C0'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.top = '0'
                                    e.currentTarget.style.boxShadow = '0 8px 0 #f0f0f0'
                                    e.currentTarget.style.borderColor = '#f0f0f0'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#e0f7fa',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    color: '#00A6C0',
                                    boxShadow: 'inset 0 -4px 0 rgba(0, 166, 192, 0.2), 0 4px 10px rgba(0, 166, 192, 0.1)'
                                }}>
                                    <item.icon size={36} className="animate-float" style={{ animationDuration: '3s' }} />
                                </div>
                                <h3 style={{
                                    fontWeight: 900,
                                    fontSize: '22px',
                                    color: '#001F3F',
                                    marginBottom: '16px',
                                    fontFamily: 'Fredoka'
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#666',
                                    lineHeight: 1.6,
                                    maxWidth: '240px',
                                    fontWeight: 600
                                }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ KIDS ADVENTURE COURSES ════════════════════════════ */}
            <section style={{ background: '#FFFDF9', padding: '80px 24px', position: 'relative' }}>
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
                            <h2 style={{ fontSize: '52px', color: '#001F3F', fontFamily: 'Fredoka' }}>Collectible Lessons</h2>
                            <p style={{ color: '#888', fontSize: 18, marginTop: 8, fontWeight: 600 }}>Puffy, rewarding educational classes that kids absolutely love.</p>
                        </div>
                        <Link to="/courses" className="btn-outline" style={{ borderRadius: 30 }}>
                            All Playgrounds <ChevronRight size={18} />
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
                                <p style={{ marginTop: 20, color: '#001F3F', fontWeight: 700 }}>Locating toy boxes...</p>
                            </div>
                        ) : courses.map(course => (
                            <div key={course.id || course._id} className="wiggle-hover" style={{ position: 'relative' }}>
                                {/* Bouncy child tag */}
                                <div style={{
                                    position: 'absolute',
                                    top: -12,
                                    left: 20,
                                    zIndex: 10,
                                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                                    color: '#fff',
                                    fontFamily: 'Fredoka',
                                    fontWeight: 900,
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    boxShadow: '0 4px 0 #cc4b4b',
                                    transform: 'rotate(-4deg)'
                                }}>
                                    ✨ SUPER FUN!
                                </div>
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ LATEST INSIGHTS SECTION ═══════════════════════════ */}
            <section style={{ padding: '40px 24px', background: '#F4F7F9' }}>
                <div className="section-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '64px', flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <h2 style={{ fontSize: '52px', color: '#001F3F', fontFamily: 'Fredoka' }}>Playground Stories</h2>
                            <p style={{ color: '#888', fontSize: 18, marginTop: 8, fontWeight: 600 }}>Explore tips, insights, and stories from our creative parenting dashboard.</p>
                        </div>
                        <Link to="/blog" style={{ color: '#00A6C0', textDecoration: 'none', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            Visit Library <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
                        {[
                            {
                                title: "Nurturing Personal Character in a Digital Classroom",
                                cat: "Modern Parenting",
                                img: "/blog/insight-personal-learning.png",
                                date: "March 31, 2026"
                            },
                            {
                                title: "The Vital Role of Moral Values in Early Development",
                                cat: "Growth & Minds",
                                img: "/blog/insight-human-values.png",
                                date: "March 28, 2026"
                            },
                            {
                                title: "Fun Daily Sharing Games to Play with Toddlers",
                                cat: "Kids Activities",
                                img: "/blog/dance.png",
                                date: "Oct 8, 2025"
                            }
                        ].map((post, i) => (
                            <Link key={i} to="/blog" style={{ textDecoration: 'none' }} className="blog-card-home">
                                <div className="kids-card wiggle-hover" style={{ background: '#fff', border: '3px solid #eee' }}>
                                    <div style={{ height: '220px', overflow: 'hidden' }}>
                                        <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '28px' }}>
                                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                            <span style={{ fontSize: 11, fontWeight: 900, color: '#00A6C0', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Fredoka' }}>{post.cat}</span>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#999' }}>• {post.date}</span>
                                        </div>
                                        <h3 style={{ fontSize: '20px', color: '#001F3F', fontWeight: 800, lineHeight: 1.4, height: '56px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: 'Fredoka' }}>
                                            {post.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PARENTS TRUST SECTION ═════════════════════════════ */}
            <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFFDF9 0%, #FFF5EE 100%)', position: 'relative' }}>
                <div className="section-container mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '60px', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EBF5FF', padding: '8px 20px', borderRadius: '40px', border: '2px solid #CCEAFF', marginBottom: 20 }}>
                            <Shield size={18} color="#00A6C0" />
                            <span style={{ fontSize: 12, fontWeight: 900, color: '#00A6C0', fontFamily: 'Fredoka' }}>PARENTS COMFORT AREA</span>
                        </div>
                        <h2 style={{ fontSize: '48px', color: '#001F3F', fontFamily: 'Fredoka', marginBottom: '24px', lineHeight: 1.2 }}>
                            Safe, Certified & Loved by Thousands of Families!
                        </h2>
                        <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.8, marginBottom: '32px', fontWeight: 600 }}>
                            EduValues is built in collaboration with pediatric psychologists and character education teachers. We provide completely secure, ad-free environments focusing purely on positive behavioral growth.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { title: 'Pediatric Certified Curriculum', desc: 'Syllabus designed strictly around kid moral values milestones.', c: '#1DD1A1' },
                                { title: 'Complete Safety Focus', desc: 'Strictly zero ads, external tracking, or open-chat rooms.', c: '#00D2D3' },
                                { title: 'Parent Portal Insights', desc: 'Easily monitor streaks, completed moral lessons, and download certificates.', c: '#FF9F43' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${item.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Award size={22} color={item.c} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#001F3F', marginBottom: 4, fontFamily: 'Fredoka' }}>{item.title}</h4>
                                        <p style={{ fontSize: '14px', color: '#777', fontWeight: 600 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fun Illustrative Trust Box */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="kids-card animate-float" style={{
                            background: '#fff',
                            border: '4px solid #FFD8CC',
                            boxShadow: '0 12px 0 #FFD8CC',
                            borderRadius: '40px',
                            padding: '40px',
                            maxWidth: '440px',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            {/* Puffy rainbow decorative label */}
                            <div style={{ position: 'absolute', top: -16, right: 30, background: '#FFD000', color: '#001F3F', fontFamily: 'Fredoka', fontWeight: 900, padding: '4px 14px', borderRadius: '10px', fontSize: 11, boxShadow: '0 3px 0 #bfa200' }}>
                                ⭐ 5-STAR SAFETY
                            </div>

                            <div style={{ width: 90, height: 90, background: '#FFF0EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <Smile size={50} color="#FF9F43" className="animate-float" style={{ animationDuration: '3s' }} />
                            </div>

                            <h3 style={{ fontSize: '26px', color: '#001F3F', fontFamily: 'Fredoka', marginBottom: '16px' }}>
                                Parent Verified
                            </h3>
                            <p style={{ color: '#666', fontSize: '15px', fontWeight: 600, lineHeight: 1.6, marginBottom: '24px' }}>
                                "The progress tracker is brilliant. Seeing Joey receive his printed Certificate of Completion was an extremely emotional moment!"
                            </p>
                            <div style={{ fontWeight: 800, color: '#FF9F43', fontSize: '16px' }}>
                                — Sarah J., Proud Mom
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS SECTION ═════════════════════════════════ */}
            <section style={{ padding: '80px 24px', background: '#FFFDF9' }}>
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <div style={{ color: '#FFB08E', fontWeight: 900, letterSpacing: 2, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', fontFamily: '"Fredoka", sans-serif' }}>WHAT PARENTS SAY</div>
                    <h2 style={{ fontSize: '56px', fontWeight: 900, color: '#001F3F', marginBottom: '80px', fontFamily: '"Fredoka", sans-serif' }}>Happy Families</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '40px'
                    }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {/* Bubble */}
                                <div className="kids-card wiggle-hover" style={{
                                    backgroundColor: t.bgColor,
                                    padding: '40px',
                                    borderRadius: '40px',
                                    border: `3px dashed ${t.borderColor}`,
                                    boxShadow: '0 10px 0 ' + t.borderColor,
                                    position: 'relative',
                                    marginBottom: '30px',
                                    textAlign: 'center'
                                }}>
                                    {/* Quote Marks - Top Left */}
                                    <div style={{ position: 'absolute', top: -15, left: 30, backgroundColor: t.quoteColor, padding: 8, borderRadius: 10, color: '#fff' }}>
                                        <Quote size={20} fill="#fff" />
                                    </div>

                                    <p style={{ fontStyle: 'italic', color: '#444', lineHeight: 1.8, fontSize: 16, fontWeight: 600 }}>
                                        "{t.text}"
                                    </p>

                                    {/* Quote Marks - Bottom Right */}
                                    <div style={{ position: 'absolute', bottom: -15, right: 30, backgroundColor: t.quoteColor, padding: 8, borderRadius: 10, color: '#fff' }}>
                                        <Quote size={20} fill="#fff" transform="rotate(180)" />
                                    </div>

                                    {/* Speech Bubble Tail */}
                                    <div style={{ position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)', width: 40, height: 20 }}>
                                        <svg viewBox="0 0 40 20" style={{ fill: t.bgColor, width: '100%', height: '100%' }}>
                                            <path d="M0,0 L40,0 L20,20 Z" />
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
                                        <div style={{ fontWeight: 800, fontSize: 18, color: '#001F3F', fontFamily: 'Fredoka' }}>{t.name}</div>
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
                    }} className="mobile-padding">
                        <div style={{ maxWidth: '640px' }} className="hero-content">
                            <h2 style={{ fontSize: '62px', color: '#fff', marginBottom: '24px', lineHeight: 1.1, fontFamily: 'Fredoka' }}>
                                Start Your Child's <br /> Magical Education!
                            </h2>
                            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Join thousands of families building a brighter character through play.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/courses" style={{
                                background: '#fff',
                                color: '#001F3F',
                                padding: '16px 40px',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                fontWeight: 900,
                                fontFamily: '"Fredoka", sans-serif',
                                fontSize: '20px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 8px 0 #ccd8e0, 0 15px 25px rgba(0,0,0,0.15)',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                                top: 0
                            }} 
                            onMouseEnter={e => {
                                e.currentTarget.style.top = '-2px';
                                e.currentTarget.style.boxShadow = '0 10px 0 #ccd8e0, 0 20px 30px rgba(0,0,0,0.2)';
                            }} 
                            onMouseLeave={e => {
                                e.currentTarget.style.top = '0';
                                e.currentTarget.style.boxShadow = '0 8px 0 #ccd8e0, 0 15px 25px rgba(0,0,0,0.15)';
                            }}
                            onMouseDown={e => {
                                e.currentTarget.style.top = '6px';
                                e.currentTarget.style.boxShadow = '0 2px 0 #ccd8e0, 0 5px 10px rgba(0,0,0,0.1)';
                            }}
                            onMouseUp={e => {
                                e.currentTarget.style.top = '-2px';
                                e.currentTarget.style.boxShadow = '0 10px 0 #ccd8e0, 0 20px 30px rgba(0,0,0,0.2)';
                            }}>
                                Explore Courses <Rocket size={24} color="#00A6C0" fill="#00A6C0" className="animate-float" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ VE JOY MASCOT GUIDING WIDGET 🐰 ════════════════════ */}
            <div 
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    gap: 12
                }}
            >
                {/* Dialogue bubble */}
                <div style={{
                    background: '#FFF',
                    border: '3px solid #00A6C0',
                    boxShadow: '0 8px 0 rgba(0, 166, 192, 0.25)',
                    borderRadius: '24px',
                    padding: '16px 20px',
                    maxWidth: '260px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#001F3F',
                    fontFamily: 'Fredoka',
                    position: 'relative',
                    textAlign: 'center',
                    animation: 'float 5s infinite'
                }}>
                    {mascotMessage}

                    {/* Stats inside dialogue */}
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 10, borderTop: '2px solid #EBF5FF', paddingTop: 8 }}>
                        <span style={{ color: '#FF9F43' }}>⭐ {magicStars} Stars</span>
                        <span style={{ color: '#FF6B6B' }}>🔥 {streak} Streak</span>
                    </div>

                    {/* Speech bubble arrow pointer */}
                    <div style={{ position: 'absolute', bottom: -10, right: 30, width: 20, height: 10 }}>
                        <svg viewBox="0 0 20 10" style={{ fill: '#FFF', width: '100%', height: '100%' }}>
                            <polygon points="0,0 20,0 10,10" stroke="#00A6C0" strokeWidth="3" />
                        </svg>
                    </div>
                </div>

                {/* Guiding Mascot Button */}
                <button
                    onClick={handleMascotClick}
                    style={{
                        background: 'linear-gradient(135deg, #FFD000, #FFA800)',
                        border: '4px solid #001F3F',
                        boxShadow: '0 8px 0 #001F3F',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transform: wigglingMascot ? 'scale(1.2) rotate(15deg)' : 'scale(1) rotate(0deg)',
                        transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        outline: 'none'
                    }}
                >
                    <svg viewBox="0 0 100 100" style={{ width: '60px', height: '60px' }}>
                        {/* Super cute cartoon bunny guide face */}
                        {/* Ears */}
                        <ellipse cx="35" cy="25" rx="8" ry="20" fill="#fff" stroke="#001F3F" strokeWidth="4" />
                        <ellipse cx="35" cy="25" rx="4" ry="12" fill="#FFB6C1" />
                        <ellipse cx="65" cy="25" rx="8" ry="20" fill="#fff" stroke="#001F3F" strokeWidth="4" />
                        <ellipse cx="65" cy="25" rx="4" ry="12" fill="#FFB6C1" />
                        
                        {/* Head */}
                        <circle cx="50" cy="65" r="28" fill="#fff" stroke="#001F3F" strokeWidth="4" />
                        
                        {/* Cheeks */}
                        <circle cx="34" cy="72" r="6" fill="#FFB6C1" opacity="0.7" />
                        <circle cx="66" cy="72" r="6" fill="#FFB6C1" opacity="0.7" />

                        {/* Eyes */}
                        <circle cx="42" cy="62" r="4.5" fill="#001F3F" />
                        <circle cx="43" cy="60" r="1.5" fill="#fff" />
                        <circle cx="58" cy="62" r="4.5" fill="#001F3F" />
                        <circle cx="59" cy="60" r="1.5" fill="#fff" />

                        {/* Nose & Mouth */}
                        <polygon points="50,68 47,65 53,65" fill="#FF6B6B" />
                        <path d="M47,70 Q50,73 53,70" stroke="#001F3F" strokeWidth="3" fill="none" />
                    </svg>
                </button>
            </div>

            <Footer />

            <style>{`
                .animated-cloud-bg {
                    position: absolute;
                    inset: 0;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900"><path d="M120 200 C150 180, 200 180, 230 210 C250 200, 300 210, 320 240 C340 240, 350 280, 320 310 C320 310, 100 310, 120 200 Z" fill="rgba(255,255,255,0.06)"/></svg>');
                    background-repeat: repeat-x;
                    background-size: 1440px 900px;
                    opacity: 0.85;
                    animation: drift 120s linear infinite;
                    pointer-events: none;
                    zIndex: 2;
                }

                @keyframes drift {
                    from { background-position: 0 0; }
                    to { background-position: 1440px 0; }
                }

                @media (max-width: 900px) {
                    .hero-content { text-align: center; }
                    .hero-content p { margin: 0 auto 40px !important; }
                    .hero-content div { justify-content: center; }
                    h2 { font-size: 40px !important; }
                    .desktop-only { display: none !important; }
                }

                @media (max-width: 600px) {
                    .hero-title { font-size: clamp(34px, 11vw, 46px) !important; }
                    .hero-text-wrapper { text-align: center; display: flex; flex-direction: column; align-items: center; }
                    .hero-text-wrapper p { text-align: center; }
                    .floating-decor { display: none !important; }
                    .mobile-stack { flex-direction: column !important; gap: 16px !important; width: 100%; }
                    .mobile-stack a { width: 100% !important; height: auto !important; font-size: 18px !important; justify-content: center; padding: 16px 24px !important; }
                    .mobile-padding { padding: 40px 20px !important; border-radius: 24px !important; }
                    h2 { font-size: 32px !important; line-height: 1.2 !important; }
                    p { font-size: 16px !important; }
                }
            `}</style>
        </div>
    )
}
