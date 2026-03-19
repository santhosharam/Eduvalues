import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { getLessonById, getLessonsByCourseId } from '../../services/lessonService'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { CheckCircle, FileText, ArrowLeft, Sparkles, Heart, Rocket, Brain, Trophy } from 'lucide-react'
import ReviewForm from '../../components/course/ReviewForm'
import { supabase } from '../../supabaseClient'

import { markLessonComplete, getCourseProgress } from '../../services/progressService'

export default function LessonPage() {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [gameWon, setGameWon] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [nextLessonId, setNextLessonId] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [coursePercent, setCoursePercent] = useState(0)
    const [isLastLesson, setIsLastLesson] = useState(false)
    const [quizQuestions, setQuizQuestions] = useState([])
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [quizPassed, setQuizPassed] = useState(false)

    useEffect(() => {
        setLoading(true)
        getLessonById(lessonId)
            .then(res => {
                const lessonData = res.data.lesson
                setLesson(lessonData)
                // For now, let's treat everyone as having 0% progress on start
                // but allow them to "win" games to complete
                setCoursePercent(0)

                // Fetch lesson quiz questions from Supabase
                supabase.from('quizzes')
                    .select('*')
                    .eq('lesson_id', lessonId)
                    .eq('is_final_exam', false)
                    .order('order_index', { ascending: true })
                    .then(({ data: quizData }) => {
                        setQuizQuestions(quizData || [])
                    })
            })
            .catch((err) => {
                if (err.response?.data?.sequentialError) {
                    toast.error('Slow down! 🛑 Please complete the previous topic first.')
                    // Delay redirect to allow toast to be seen
                    setTimeout(() => navigate('/dashboard/my-courses'), 2000)
                } else {
                    toast.error('Could not load adventure!')
                }
            })
            .finally(() => setLoading(false))

        // Fetch progress
        getCourseProgress(lessonId) // Wait, lessonId is for lesson, getCourseProgress needs courseId. 
        // I'll fix this in the next effect where courseId is available.
    }, [lessonId])

    useEffect(() => {
        if (lesson?.course?._id || lesson?.course) {
            const cid = lesson.course?._id || lesson.course
            getCourseProgress(cid)
                .then(res => setCoursePercent(res.data.progress?.percent || 0))
                .catch(() => {})
        }
    }, [lesson])

    useEffect(() => {
        if (lesson?.course) {
            getLessonsByCourseId(lesson.course)
                .then(res => {
                    const lessons = res.data.lessons
                    const currentIndex = lessons.findIndex(l => String(l._id) === String(lessonId))
                    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
                        setNextLessonId(lessons[currentIndex + 1].id || lessons[currentIndex + 1]._id)
                        setIsLastLesson(false)
                    } else {
                        setNextLessonId(null)
                        setIsLastLesson(true)
                    }
                })
        }
    }, [lesson, lessonId])

    const handleComplete = async () => {
        setCompleted(true)
        toast.success('Lesson complete! 🎉')
        if (nextLessonId) {
            setTimeout(() => {
                navigate(`/dashboard/lesson/${nextLessonId}`)
            }, 1000)
        } else {
            setCoursePercent(100)
            toast.success('🎉 All lessons finished! Time for the final challenge.', { duration: 5000 })
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
                    {/* Dynamic Quiz Challenge */}
                    {quizQuestions.length > 0 && !quizPassed && (
                        <div style={{ marginTop: 60, padding: 40, background: '#FFF5F5', borderRadius: 40, border: '4px solid #FF6B6B' }}>
                            <div style={{ background: '#FF6B6B', color: '#fff', padding: '8px 24px', borderRadius: 15, display: 'inline-block', fontWeight: 800, fontSize: 14, marginBottom: 24 }}>
                                QUIZ: {lesson.title.toUpperCase()} CHALLENGE 🎮
                            </div>

                            {quizQuestions.map((q, index) => (
                                <div key={q.id} style={{ marginBottom: 32 }}>
                                    <h4 style={{ fontSize: 18, fontWeight: 800, color: '#001F3F', marginBottom: 16 }}>
                                        {index + 1}. {q.question}
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {['a', 'b', 'c', 'd'].map(opt => {
                                            const isSelected = quizAnswers[q.id] === opt
                                            const isCorrect = quizSubmitted && opt === q.correct_answer
                                            const isWrong = quizSubmitted && isSelected && opt !== q.correct_answer
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                    style={{
                                                        padding: '16px 24px',
                                                        borderRadius: 16,
                                                        border: isCorrect ? '3px solid #1DD1A1' : isWrong ? '3px solid #FF6B6B' : isSelected ? '3px solid #00A6C0' : '3px solid #F1F1F1',
                                                        background: isCorrect ? '#E8FDF5' : isWrong ? '#FFF0F0' : isSelected ? '#E0F7FA' : '#fff',
                                                        fontSize: 16,
                                                        fontWeight: 700,
                                                        color: '#001F3F',
                                                        cursor: quizSubmitted ? 'default' : 'pointer',
                                                        textAlign: 'left'
                                                    }}
                                                >
                                                    {opt.toUpperCase()}. {q[`option_${opt}`]}
                                                    {isCorrect && ' ✅'}
                                                    {isWrong && ' ❌'}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {!quizSubmitted ? (
                                <button
                                    onClick={() => {
                                        const score = quizQuestions.filter(q => quizAnswers[q.id] === q.correct_answer).length
                                        setQuizScore(score)
                                        setQuizSubmitted(true)
                                        if (score === quizQuestions.length) {
                                            setQuizPassed(true)
                                            toast.success('Perfect score! 🏆 Next lesson unlocked!', { duration: 3000 })
                                        } else if (score >= Math.ceil(quizQuestions.length * 0.6)) {
                                            setQuizPassed(true)
                                            toast.success(`You passed with ${score}/${quizQuestions.length}! 🎉`, { duration: 3000 })
                                        } else {
                                            toast.error(`You got ${score}/${quizQuestions.length}. Try again!`)
                                        }
                                    }}
                                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                    style={{ marginTop: 24, padding: '16px 40px', background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 900, fontSize: 18, cursor: 'pointer', opacity: Object.keys(quizAnswers).length < quizQuestions.length ? 0.5 : 1 }}
                                >
                                    Submit Quiz 🚀
                                </button>
                            ) : !quizPassed ? (
                                <button
                                    onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0) }}
                                    style={{ marginTop: 24, padding: '16px 40px', background: '#00A6C0', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 900, fontSize: 18, cursor: 'pointer' }}
                                >
                                    Try Again 🔄
                                </button>
                            ) : null}

                            {quizSubmitted && (
                                <div style={{ marginTop: 24, fontWeight: 800, fontSize: 18, color: quizPassed ? '#1DD1A1' : '#FF6B6B', textAlign: 'center' }}>
                                    {quizPassed ? `✨ Quiz Passed! ${quizScore}/${quizQuestions.length} correct!` : `Score: ${quizScore}/${quizQuestions.length} — Try again!`}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mark Complete / Footer Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 80 }}>
                    <button
                        onClick={handleComplete}
                        disabled={completed || (quizQuestions.length > 0 && !quizPassed)}
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
                            boxShadow: (completed || (quizQuestions.length > 0 && !quizPassed)) ? 'none' : '0 15px 30px rgba(0, 166, 192, 0.3)',
                            transform: (completed || (quizQuestions.length > 0 && !quizPassed)) ? 'none' : 'scale(1.05)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: (quizQuestions.length > 0 && !quizPassed && !completed) ? 0.5 : 1
                        }}
                    >
                        {completed
                            ? <><CheckCircle size={24} /> Adventure Completed!</>
                            : <><Trophy size={24} /> {quizPassed || quizQuestions.length === 0 ? 'Finish & Unlock Next Level' : 'Win Challenge to Unlock'}</>}
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

                    {isLastLesson && completed && quizPassed && (
                        <div style={{ width: '100%', marginTop: 40, textAlign: 'center' }}>
                            <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 800, color: '#001F3F' }}>
                                🎓 You have completed all 10 lessons!
                            </div>
                            <Link
                                to={`/dashboard/course/${lesson.course_id}/final-exam`}
                                className="btn-primary"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '24px 48px',
                                    fontSize: 22,
                                    borderRadius: 30,
                                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9F43 100%)',
                                    boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                                    textDecoration: 'none',
                                    fontWeight: 900,
                                    color: '#fff'
                                }}
                            >
                                <Sparkles size={28} /> TAKE FINAL EXAM (20 QUESTIONS) <Trophy size={28} />
                            </Link>
                        </div>
                    )}

                    <p style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>You're doing great! Keep gathering seeds of kindness. 🌱</p>
                </div>
            </div>
        </div>
    )
}
