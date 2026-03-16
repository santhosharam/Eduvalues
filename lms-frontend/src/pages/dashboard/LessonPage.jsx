import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { markLessonComplete } from '../../services/progressService'
import api from '../../services/api'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { CheckCircle, FileText, ArrowLeft, Sparkles, Heart, Rocket, Brain, Trophy } from 'lucide-react'
import ReviewForm from '../../components/course/ReviewForm'

export default function LessonPage() {
    const { lessonId } = useParams()
    const [lesson, setLesson] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [gameWon, setGameWon] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [nextLessonId, setNextLessonId] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [coursePercent, setCoursePercent] = useState(0)

    const kindnessGame = {
        question: "Maya sees Mr. Jenkins looking sad and his garden is full of weeds. What should she do?",
        options: [
            { text: "Go home and play video games", correct: false, feedback: "Oh no! That doesn't help Mr. Jenkins smile. 🎮" },
            { text: "Help him pull weeds and plant flowers", correct: true, feedback: "YES! You're a Kindness Superhero! 🌸✨" },
            { text: "Wait for someone else to do it", correct: false, feedback: "Maya wants to be the one to plant seeds of joy! 🌱" }
        ]
    }

    useEffect(() => {
        setLoading(true)
        api.get(`/lessons/${lessonId}`)
            .then(r => {
                setLesson(r.data.lesson)
                // Also check if already completed
                api.get(`/progress/${r.data.lesson.course}`)
                    .then(pr => {
                        setCoursePercent(pr.data.progress.percent || 0)
                        if (pr.data.progress.completedLessons.includes(lessonId)) {
                            setCompleted(true)
                            setGameWon(true)
                        }
                    })
            })
            .catch(() => toast.error('Could not load lesson'))
            .finally(() => setLoading(false))
    }, [lessonId])

    useEffect(() => {
        if (lesson?.course) {
            api.get(`/lessons/course/${lesson.course}`)
                .then(res => {
                    const lessons = res.data.lessons
                    const currentIndex = lessons.findIndex(l => String(l._id) === String(lessonId))
                    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
                        setNextLessonId(lessons[currentIndex + 1]._id)
                    } else {
                        setNextLessonId(null)
                    }
                })
        }
    }, [lesson, lessonId])

    const handleComplete = async () => {
        if (!lesson?.course) return
        try {
            const res = await markLessonComplete(lesson.course, lessonId)
            setCompleted(true)
            setCoursePercent(res.data.percent)
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFB', position: 'relative', overflow: 'hidden' }}>
            <Navbar />

            {/* Decorative Floating Elements */}
            <div style={{ position: 'absolute', top: '150px', left: '5%', opacity: 0.1, pointerEvents: 'none' }}><Sparkles size={120} color="#FF9F43" /></div>
            <div style={{ position: 'absolute', bottom: '100px', right: '5%', opacity: 0.1, pointerEvents: 'none' }}><Heart size={150} color="#FF6B6B" /></div>
            <div style={{ position: 'absolute', top: '40%', right: '8%', opacity: 0.1, pointerEvents: 'none' }}><Rocket size={100} color="#00A6C0" /></div>

            <div style={{ flex: 1, padding: '40px 24px', maxWidth: 1000, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <Link to="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#001F3F', textDecoration: 'none', fontSize: 15, fontWeight: 700, background: '#fff', padding: '10px 20px', borderRadius: 15, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <ArrowLeft size={18} /> Exit Adventure
                    </Link>
                    <div style={{ background: '#00A6C0', color: '#fff', padding: '10px 24px', borderRadius: 20, fontWeight: 800, fontSize: 14, boxShadow: '0 10px 20px rgba(0,166,192,0.2)' }}>
                        LEVEL: EXPLORER 🌟
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        background: '#fff',
                        borderRadius: '24px',
                        marginBottom: 24,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                        transform: 'rotate(-5deg)'
                    }}>
                        <Brain size={40} color="#00A6C0" />
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, color: '#001F3F', fontFamily: '"Fredoka", sans-serif', marginBottom: 16 }}>{lesson.title} Adventure</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <span style={{ background: '#FF9F43', color: '#fff', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 800 }}>STORY TIME 📖</span>
                        <span style={{ background: '#1DD1A1', color: '#fff', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: 800 }}>VALUE: {lesson.title.toUpperCase()} ❤️</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    background: '#fff',
                    padding: '60px 40px',
                    borderRadius: '40px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                    border: '2px solid #F1F1F1',
                    marginBottom: 40,
                    position: 'relative'
                }}>
                    {/* Corner Decoration */}
                    <div style={{ position: 'absolute', top: -15, right: 30, background: '#FF6B6B', color: '#fff', padding: '8px 20px', borderRadius: '12px', fontWeight: 800, fontSize: 12, transform: 'rotate(5deg)' }}>
                        LET'S LEARN! ✨
                    </div>

                    {/* Content */}
                    <div className="lesson-content">
                        {safeContent && (
                            <div dangerouslySetInnerHTML={{ __html: safeContent }} />
                        )}
                    </div>

                    {/* Resources */}
                    {lesson.resources?.length > 0 && (
                        <div style={{ marginTop: 60, padding: 32, background: '#F8FAFB', borderRadius: 30, border: '2px dashed #D1D5DB' }}>
                            <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 800, color: '#001F3F', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <FileText size={24} color="#00A6C0" /> Adventure Loot (Resources)
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                {lesson.resources.map((r, i) => (
                                    <a key={i} href={r.url} download style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#001F3F', textDecoration: 'none', fontSize: 15, fontWeight: 700, padding: '16px', borderRadius: 16, background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ width: 36, height: 36, background: '#E0F2F1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={18} color="#00A6C0" />
                                        </div>
                                        {r.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Values Challenge Mini-Game */}
                    {lesson.quiz?.length > 0 && !completed && (
                        <div style={{ marginTop: 60, padding: 40, background: '#FFF5F5', borderRadius: 40, border: '4px solid #FF6B6B', textAlign: 'center' }}>
                            <div style={{ background: '#FF6B6B', color: '#fff', padding: '8px 24px', borderRadius: 15, display: 'inline-block', fontWeight: 800, fontSize: 14, marginBottom: 24 }}>
                                MINI-GAME: {lesson.title.toUpperCase()} CHALLENGE ({currentQuestionIndex + 1}/{lesson.quiz.length}) 🎮
                            </div>
                            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#001F3F', marginBottom: 32, lineHeight: 1.4 }}>
                                {lesson.quiz[currentQuestionIndex].question}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {lesson.quiz[currentQuestionIndex].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedOption(i);
                                            if (opt.correct) {
                                                toast.success(opt.feedback || "Great job!", { icon: '✨' });
                                                
                                                // Wait a bit before moving to next question or winning
                                                setTimeout(() => {
                                                    setSelectedOption(null);
                                                    if (currentQuestionIndex < lesson.quiz.length - 1) {
                                                        setCurrentQuestionIndex(prev => prev + 1);
                                                    } else {
                                                        setGameWon(true);
                                                        toast.success("AMAZING! You passed all challenges! 🏆", { duration: 4000 });
                                                    }
                                                }, 1500);
                                            } else {
                                                toast.error(opt.feedback || "Try again!");
                                                setTimeout(() => setSelectedOption(null), 1000);
                                            }
                                        }}
                                        style={{
                                            padding: '20px 32px',
                                            borderRadius: 20,
                                            border: selectedOption === i ? (opt.correct ? '3px solid #1DD1A1' : '3px solid #FF6B6B') : '3px solid #F1F1F1',
                                            background: '#fff',
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: '#001F3F',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 12,
                                            pointerEvents: selectedOption !== null ? 'none' : 'auto'
                                        }}
                                    >
                                        {opt.text}
                                        {selectedOption === i && (opt.correct ? ' ✅' : ' ❌')}
                                    </button>
                                ))}
                            </div>

                            {gameWon && (
                                <div style={{ marginTop: 32, color: '#1DD1A1', fontWeight: 800, fontSize: 18 }}>
                                    ✨ ALL LEVELS UNLOCKED! Finish below to continue. ✨
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mark Complete / Footer Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 80 }}>
                    <button
                        onClick={handleComplete}
                        disabled={completed || (lesson.quiz?.length > 0 && !gameWon)}
                        className={completed ? 'btn-secondary' : 'btn-primary'}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            width: '100%',
                            maxWidth: 400,
                            height: 72,
                            fontSize: 20,
                            fontWeight: 900,
                            borderRadius: '25px',
                            boxShadow: (completed || (lesson.quiz?.length > 0 && !gameWon)) ? 'none' : '0 15px 30px rgba(0, 166, 192, 0.3)',
                            transform: (completed || (lesson.quiz?.length > 0 && !gameWon)) ? 'none' : 'scale(1.05)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: (lesson.quiz?.length > 0 && !gameWon && !completed) ? 0.5 : 1
                        }}
                    >
                        {completed
                            ? <><CheckCircle size={24} /> Adventure Completed!</>
                            : <><Trophy size={24} /> {gameWon || !lesson.quiz?.length ? 'Finish & Unlock Next Level' : 'Win Challenge to Unlock'}</>}
                    </button>

                    {completed && nextLessonId && (
                        <Link
                            to={`/dashboard/lesson/${nextLessonId}`}
                            className="btn-primary"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                width: '100%',
                                maxWidth: 400,
                                height: 72,
                                fontSize: 20,
                                fontWeight: 900,
                                borderRadius: '25px',
                                background: '#1DD1A1',
                                border: 'none',
                                textDecoration: 'none',
                                boxShadow: '0 15px 30px rgba(29, 209, 161, 0.3)',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            <Rocket size={24} /> Start Next Adventure!
                        </Link>
                    )}

                    {coursePercent === 100 && (
                        <div style={{ width: '100%', marginTop: 40 }}>
                            <ReviewForm courseId={lesson.course} />
                        </div>
                    )}

                    <p style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>You're doing great! Keep gathering seeds of kindness. 🌱</p>
                </div>
            </div>
        </div>
    )
}
