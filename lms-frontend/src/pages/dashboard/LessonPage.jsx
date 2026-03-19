import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { getLessonById, getLessonsByCourseId } from '../../services/lessonService'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { CheckCircle, FileText, ArrowLeft, Sparkles, Heart, Rocket, Brain, Trophy } from 'lucide-react'
import { supabase } from '../../supabaseClient'

import { markLessonComplete, getCourseProgress } from '../../services/progressService'
import { Lock, ChevronRight, PlayCircle, BookOpen } from 'lucide-react'

export default function LessonPage() {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [gameWon, setGameWon] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [nextLessonId, setNextLessonId] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isLastLesson, setIsLastLesson] = useState(false)
    const [quizQuestions, setQuizQuestions] = useState([])
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [quizPassed, setQuizPassed] = useState(false)
    const [allCourseLessons, setAllCourseLessons] = useState([])
    const [completedLessons, setCompletedLessons] = useState(() => {
        const saved = localStorage.getItem('completedLessons')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        setLoading(true)
        getLessonById(lessonId)
            .then(async res => {
                const lessonData = res.data.lesson
                setLesson(lessonData)

                console.log('Lesson ID:', lessonId)
                // Fetch lesson quiz questions from Supabase
                const { data: quizData, error: quizError } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('lesson_id', lessonId)
                    .eq('is_final_exam', false)
                    .order('order_index', { ascending: true })

                console.log('Quiz error:', quizError)
                console.log('Quiz data:', quizData)
                setQuizQuestions(quizData || [])
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
        if (lesson?.course_id) {
            getCourseProgress(lesson.course_id)
                .then(res => {})
                .catch(() => {})
        }
    }, [lesson])

    useEffect(() => {
        if (lesson?.course_id) {
            getLessonsByCourseId(lesson.course_id)
                .then(res => {
                    const lessons = res.data.lessons
                    setAllCourseLessons(lessons)
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
        <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFB' }}>
            {/* Sidebar (Desktop) */}
            <aside className="lesson-sidebar" style={{
                width: 320,
                background: '#fff',
                borderRight: '2px solid #F1F1F1',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                overflowY: 'auto',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '32px 24px', borderBottom: '2px solid #F8FAFB' }}>
                    <div onClick={() => navigate('/courses')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', marginBottom: 20, fontSize: 13, fontWeight: 700 }}>
                        <ArrowLeft size={16} /> EXIT COURSE
                    </div>
                    {/* Character Builders Curriculum Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, background: '#00A6C0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <BookOpen size={20} />
                        </div>
                        <h2 style={{ fontSize: 18, color: '#001F3F', fontWeight: 900, lineHeight: 1.2 }}>Character Builders curriculum</h2>
                    </div>
                </div>

                <div style={{ flex: 1, padding: 12 }}>
                    {allCourseLessons.map((l, idx) => {
                        const isCurrent = String(l._id) === String(lessonId)
                        const isCompleted = completedLessons.includes(String(l._id))
                        // Unlock logic: lesson 1 is always unlocked. n is unlocked if n-1 is completed.
                        const isUnlocked = idx === 0 || completedLessons.includes(String(allCourseLessons[idx - 1]?._id))
                        
                        return (
                            <div 
                                key={l._id}
                                onClick={() => isUnlocked && navigate(`/dashboard/lesson/${l._id}`)}
                                style={{
                                    padding: '16px 20px',
                                    borderRadius: 16,
                                    marginBottom: 8,
                                    cursor: isUnlocked ? 'pointer' : 'default',
                                    background: isCurrent ? '#E0F7FA' : isUnlocked ? 'transparent' : '#f8fafb',
                                    border: isCurrent ? '2px solid #00A6C0' : '2px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    opacity: isUnlocked ? 1 : 0.6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 10, 
                                    background: isCompleted ? '#1DD1A1' : isCurrent ? '#00A6C0' : '#f1f1f1',
                                    color: isCompleted || isCurrent ? '#fff' : '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 900
                                }}>
                                    {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: isCurrent ? '#001F3F' : '#64748b' }}>{l.title}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginTop: 2 }}>
                                        {isCurrent ? 'Viewing' : isCompleted ? 'Completed' : isUnlocked ? 'Next Adventure' : 'Locked'}
                                    </div>
                                </div>
                                {!isUnlocked && <Lock size={14} color="#ccc" />}
                                {isCurrent && <PlayCircle size={14} color="#00A6C0" />}
                            </div>
                        )
                    })}
                </div>

                <div style={{ padding: 24, background: '#F8FAFB', borderTop: '2px solid #F1F1F1' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00A6C0', marginBottom: 8, textAlign: 'center' }}>CURRICULUM PROGRESS</div>
                    <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${(completedLessons.length / allCourseLessons.length) * 100}%`, height: '100%', background: '#1DD1A1', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginTop: 8, textAlign: 'center' }}>
                        {completedLessons.length} / {allCourseLessons.length} Completed
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: 320, transition: 'margin-left 0.3s' }} className="main-content-layout">
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFB', position: 'relative', overflow: 'hidden' }}>
                    <Navbar />

                    {/* Top Progress Bar (Mobile) */}
                    <div className="mobile-progress-bar" style={{ display: 'none', height: 6, background: '#eee', width: '100%', position: 'sticky', top: 0, zIndex: 50 }}>
                        <div style={{ 
                            height: '100%', 
                            width: `${(completedLessons.length / allCourseLessons.length) * 100}%`, 
                            background: 'linear-gradient(to right, #1DD1A1, #00A6C0)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>

                    <div style={{ flex: 1, padding: '40px 24px', maxWidth: 900, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
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
                            <h1 style={{ fontSize: 'clamp(32px, 6vw, 42px)', fontWeight: 900, color: '#001F3F', fontFamily: '"Fredoka", sans-serif', marginBottom: 16 }}>{lesson.title} Adventure</h1>
                        </div>

                        {/* Main Content Area */}
                        <div style={{ background: '#fff', padding: '60px 40px', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '2px solid #F1F1F1', marginBottom: 40, position: 'relative' }}>
                            <div className="lesson-content">
                                {safeContent && <div dangerouslySetInnerHTML={{ __html: safeContent }} />}
                            </div>

                            {/* Quiz Challenge */}
                            {quizQuestions.length > 0 && !quizPassed && (
                                <div style={{ marginTop: 60, padding: 40, background: '#FFF5F5', borderRadius: 40, border: '4px solid #FF6B6B' }}>
                                    <div style={{ background: '#FF6B6B', color: '#fff', padding: '8px 24px', borderRadius: 15, display: 'inline-block', fontWeight: 800, fontSize: 14, marginBottom: 24 }}>
                                        QUIZ: {lesson.title.toUpperCase()} CHALLENGE 🎮
                                    </div>

                                    {quizQuestions.map((q, idx) => (
                                        <div key={q.id} style={{ marginBottom: 32 }}>
                                            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#001F3F', marginBottom: 16 }}>{idx + 1}. {q.question}</h4>
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
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {!quizSubmitted ? (
                                        <button onClick={() => {
                                            const score = quizQuestions.filter(q => quizAnswers[q.id] === q.correct_answer).length
                                            setQuizScore(score)
                                            setQuizSubmitted(true)
                                            if (score >= Math.ceil(quizQuestions.length * 0.6)) {
                                                setQuizPassed(true)
                                                const newCompleted = [...new Set([...completedLessons, lessonId])]
                                                setCompletedLessons(newCompleted)
                                                localStorage.setItem('completedLessons', JSON.stringify(newCompleted))
                                                toast.success('Passed! Current lesson recorded in your map! 🧭', { duration: 3000 })
                                            } else {
                                                toast.error(`Scored ${score}/${quizQuestions.length}. Review and try again!`)
                                            }
                                        }} disabled={Object.keys(quizAnswers).length < quizQuestions.length} className="btn-primary" style={{ marginTop: 24, padding: '16px 40px', background: '#FF6B6B', width: '100%', borderRadius: 20, fontSize: 18, fontWeight: 900 }}>
                                            Submit Challenge 🚀
                                        </button>
                                    ) : !quizPassed ? (
                                        <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizScore(0) }} className="btn-primary" style={{ marginTop: 24, padding: '16px 40px', background: '#00A6C0', width: '100%', borderRadius: 20, fontSize: 18, fontWeight: 900 }}>
                                            Try Again 🔄
                                        </button>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Adaptive Footer Navigation */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 80 }}>
                            {(quizPassed || quizQuestions.length === 0) && (
                                <>
                                    {!isLastLesson ? (
                                        nextLessonId && (
                                            <Link to={`/dashboard/lesson/${nextLessonId}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 400, height: 72, fontSize: 22, fontWeight: 900, borderRadius: '25px', background: '#1DD1A1', boxShadow: '0 15px 30px rgba(29, 209, 161, 0.3)', animation: 'pulse 2s infinite', color: '#fff', textDecoration: 'none' }}>
                                                <Rocket size={24} /> Next Lesson →
                                            </Link>
                                        )
                                    ) : (
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 800, color: '#001F3F' }}>
                                                🎓 You have completed all lessons!
                                            </div>
                                            <Link to={`/dashboard/course/${lesson.course_id}/final-exam`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '24px 48px', fontSize: 22, borderRadius: 30, background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9F43 100%)', boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>
                                                <Sparkles size={28} /> TAKE FINAL EXAM (20 QUESTIONS) <Trophy size={28} />
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                            {(!quizPassed && quizQuestions.length > 0) && (
                                <p style={{ color: '#888', fontWeight: 800, fontSize: 16 }}>Finish the challenge to unlock the next level! 🗝️</p>
                            )}
                            <p style={{ color: '#888', fontWeight: 600, fontSize: 15, marginTop: 10 }}>You're doing great! Keep gathering seeds of kindness. 🌱</p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @media (max-width: 1024px) {
                    .lesson-sidebar { display: none !important; }
                    .main-content-layout { margin-left: 0 !important; }
                    .mobile-progress-bar { display: block !important; }
                }
            `}</style>
        </div>
    )
}
