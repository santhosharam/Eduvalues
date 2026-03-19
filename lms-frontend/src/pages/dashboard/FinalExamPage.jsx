import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import Navbar from '../../components/common/Navbar'
import toast from 'react-hot-toast'
import { Sparkles, Trophy, Award, Printer, Download, ArrowLeft, Loader2, Heart, CheckCircle, RefreshCcw } from 'lucide-react'

export default function FinalExamPage() {
    const { courseId } = useParams()
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [loading, setLoading] = useState(true)
    const [studentName, setStudentName] = useState('')
    const certificateRef = useRef()

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('course_id', courseId)
                    .eq('is_final_exam', true)
                    .order('order_index', { ascending: true })

                if (error) throw error
                setQuestions(data || [])
            } catch (err) {
                toast.error('Failed to load final exam!')
            } finally {
                setLoading(false)
            }
        }
        fetchQuestions()
    }, [courseId])

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error('Please answer all questions before submitting!')
            return
        }

        const calculatedScore = questions.filter(q => answers[q.id] === q.correct_answer).length
        setScore(calculatedScore)
        setSubmitted(true)
        
        if (calculatedScore >= 15) {
            toast.success('CONGRATULATIONS! You have passed the Final Exam! 🏆', { duration: 5000 })
        } else {
            toast.error(`You scored ${calculatedScore}/${questions.length}. You need at least 15 to pass.`, { duration: 5000 })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFB' }}>
            <Loader2 className="spin" size={48} color="#00A6C0" />
        </div>
    )

    if (questions.length === 0) return (
        <div style={{ minHeight: '100vh', background: '#F8FAFB' }}>
            <Navbar />
            <div style={{ padding: 100, textAlign: 'center' }}>
                <h2 style={{ fontSize: 32, color: '#001F3F' }}>Final Exam Coming Soon! ⏳</h2>
                <p style={{ color: '#64748b', margin: '20px 0 32px' }}>We are still preparing the final challenges for this course.</p>
                <Link to="/" className="btn-primary">Return Home</Link>
            </div>
        </div>
    )

    // Certificate View
    if (submitted && score >= 15) {
        const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFB', paddingBottom: 100 }}>
                <Navbar />
                
                <div className="section-container" style={{ maxWidth: 900, marginTop: 60 }}>
                    <div style={{ textAlign: 'center', marginBottom: 40 }} className="no-print">
                        <Trophy size={80} color="#FFD700" style={{ marginBottom: 20 }} />
                        <h1 style={{ fontSize: 42, color: '#001F3F', fontWeight: 900 }}>YOU DID IT! 🎉</h1>
                        <p style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>You are officially a Character Builder!</p>
                        
                        <div style={{ marginTop: 40, maxWidth: 500, margin: '40px auto' }}>
                            <label style={{ display: 'block', fontSize: 16, fontWeight: 700, color: '#001F3F', marginBottom: 12 }}>Enter Your Full Name for the Certificate:</label>
                            <input 
                                type="text"
                                placeholder="e.g. Aditi Sharma"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                style={{ width: '100%', padding: '16px 24px', borderRadius: 16, border: '3px solid #00A6C0', fontSize: 18, fontWeight: 700, textAlign: 'center', color: '#001F3F' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 32 }}>
                            <button onClick={handlePrint} className="btn-primary" style={{ height: 60, padding: '0 32px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Printer size={20} /> Print Certificate
                            </button>
                        </div>
                    </div>

                    {/* Certificate Preview */}
                    <div 
                        ref={certificateRef}
                        id="certificate-print-area"
                        style={{
                            background: '#fff',
                            padding: 60,
                            borderRadius: 0,
                            border: '20px solid #001F3F',
                            position: 'relative',
                            textAlign: 'center',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                            aspectRatio: '1.414 / 1', // A4 Landscape aspect ratio
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Borders */}
                        <div style={{ position: 'absolute', inset: 10, border: '2px solid #00A6C0' }} />
                        <div style={{ position: 'absolute', top: 40, left: 40, opacity: 0.1 }}><Award size={200} color="#00A6C0" /></div>
                        <div style={{ position: 'absolute', bottom: 40, right: 40, opacity: 0.1 }}><Sparkles size={150} color="#FF9F43" /></div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                                <img src="/logo.png" alt="VE" style={{ height: 80 }} />
                            </div>
                            
                            <h4 style={{ fontSize: 24, fontWeight: 800, color: '#00A6C0', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 30 }}>Certificate of Achievement</h4>
                            
                            <p style={{ fontSize: 20, color: '#64748b', fontStyle: 'italic', marginBottom: 10 }}>This is to certify that</p>
                            
                            <h2 style={{ fontSize: 56, fontWeight: 900, color: '#001F3F', borderBottom: '3px solid #F1F1F1', display: 'inline-block', minWidth: 400, paddingBottom: 10, marginBottom: 30, fontFamily: 'serif' }}>
                                {studentName || 'Your Name'}
                            </h2>
                            
                            <p style={{ fontSize: 20, color: '#64748b', fontStyle: 'italic', marginBottom: 10 }}>has successfully completed the course</p>
                            
                            <h3 style={{ fontSize: 28, fontWeight: 800, color: '#00A6C0', marginBottom: 40 }}>
                                Character Builders: Essential Life Values for Kids
                            </h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, padding: '0 60px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, borderBottom: '1px solid #333', paddingBottom: 5, marginBottom: 5 }}>{today}</div>
                                    <div style={{ color: '#888', fontSize: 13, fontWeight: 700 }}>DATE</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                                        <Award size={40} color="#FFD700" />
                                    </div>
                                    <div style={{ color: '#888', fontSize: 13, fontWeight: 700 }}>OFFICIAL SEAL</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, borderBottom: '1px solid #333', paddingBottom: 5, marginBottom: 5 }}>Admin VE</div>
                                    <div style={{ color: '#888', fontSize: 13, fontWeight: 700 }}>INSTRUCTOR</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @media print {
                        body * { visibility: hidden; }
                        #certificate-print-area, #certificate-print-area * { visibility: visible; }
                        #certificate-print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            border: 15px solid #001F3F !important;
                            box-shadow: none !important;
                        }
                        .no-print { display: none !important; }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFB', paddingBottom: 100 }}>
            <Navbar />
            
            <div style={{ background: '#001F3F', color: '#fff', padding: '60px 24px', textAlign: 'center' }}>
                <div className="section-container">
                    <Trophy size={64} color="#FFD700" style={{ marginBottom: 20 }} />
                    <h1 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: 900 }}>Final Moral Compass Challenge 🧭</h1>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: 10 }}>Score at least 15/20 correctly to earn your certificate!</p>
                </div>
            </div>

            <main className="section-container" style={{ maxWidth: 800, marginTop: 60 }}>
                {submitted && score < 15 && (
                    <div style={{ background: '#FFF5F5', border: '3px solid #FF6B6B', padding: 32, borderRadius: 24, textAlign: 'center', marginBottom: 40 }}>
                        <Heart size={48} color="#FF6B6B" style={{ marginBottom: 16 }} />
                        <h2 style={{ color: '#001F3F', fontSize: 24, fontWeight: 900 }}>Don't give up! You almost had it.</h2>
                        <p style={{ fontSize: 18, color: '#FF6B6B', marginTop: 8, fontWeight: 800 }}>You scored {score}/{questions.length} Correct</p>
                        <button 
                            onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); window.scrollTo(0,0) }}
                            className="btn-primary" 
                            style={{ background: '#00A6C0', marginTop: 24, height: 60, padding: '0 40px', borderRadius: 20 }}
                        >
                            <RefreshCcw size={20} style={{ marginRight: 10 }} /> Try The Challenge Again
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {questions.map((q, idx) => (
                        <div key={q.id} style={{ background: '#fff', padding: 40, borderRadius: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '2px solid #F1F1F1' }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#00A6C0', color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>
                                    {idx + 1}
                                </div>
                                <h3 style={{ fontSize: 20, color: '#001F3F', fontWeight: 800, lineHeight: 1.4 }}>{q.question}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {['a', 'b', 'c', 'd'].map(opt => {
                                    const isSelected = answers[q.id] === opt
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            style={{
                                                padding: '20px 24px',
                                                borderRadius: 16,
                                                border: isSelected ? '3px solid #00A6C0' : '3px solid #F1F1F1',
                                                background: isSelected ? '#E0F7FA' : '#fff',
                                                textAlign: 'left',
                                                fontSize: 16,
                                                fontWeight: 700,
                                                cursor: submitted ? 'default' : 'pointer',
                                                color: '#001F3F',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span style={{ color: '#00A6C0', marginRight: 10 }}>{opt.toUpperCase()}.</span> {q[`option_${opt}`]}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {!submitted && (
                    <div style={{ marginTop: 60, textAlign: 'center' }}>
                        <button
                            onClick={handleSubmit}
                            className="btn-primary"
                            style={{
                                background: '#1DD1A1',
                                height: 80,
                                padding: '0 60px',
                                fontSize: 24,
                                borderRadius: 25,
                                boxShadow: '0 15px 30px rgba(29, 209, 161, 0.3)',
                                opacity: Object.keys(answers).length < questions.length ? 0.5 : 1
                            }}
                        >
                            SUBMIT FINAL EXAM 🚀
                        </button>
                        <p style={{ marginTop: 24, color: '#888', fontWeight: 600 }}>Gather all your wisdom and send it to the heavens! ✨</p>
                    </div>
                )}
            </main>
        </div>
    )
}
