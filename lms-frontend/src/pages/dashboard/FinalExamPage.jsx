import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import toast from 'react-hot-toast'
import { Sparkles, Trophy, Award, Printer, Download, ArrowLeft, Loader2, Heart, CheckCircle, RefreshCcw, Compass } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext'
import { getFinalExam } from '../../services/courseService'
import { completeCourse } from '../../services/certificateService'

export default function FinalExamPage() {
    const { courseId } = useParams()
    const { user } = useAuth()
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [loading, setLoading] = useState(true)
    const [studentName, setStudentName] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [resolvedId, setResolvedId] = useState(courseId)
    const [course, setCourse] = useState(null)
    const certificateRef = useRef()

    useEffect(() => {
        if (user?.name && !studentName) {
            setStudentName(user.name)
        }
    }, [user])

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true)
            try {
                // 1. Resolve UUID / Slug to get exact course data
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
                let currentResolvedId = courseId;
                let courseData = null;

                if (isUuid) {
                    const { data: cData, error: cErr } = await supabase
                        .from('courses')
                        .select('*')
                        .eq('id', courseId)
                        .single();
                    if (!cErr) courseData = cData;
                } else {
                    const { data: cData, error: cErr } = await supabase
                        .from('courses')
                        .select('*')
                        .eq('slug', courseId)
                        .single();
                    if (!cErr && cData) {
                        courseData = cData;
                        currentResolvedId = cData.id;
                    }
                }

                if (courseData) {
                    setCourse(courseData);
                    setResolvedId(currentResolvedId);
                }

                // 2. Fetch the questions using the resolved UUID via backend API (bypassing RLS)
                const res = await getFinalExam(currentResolvedId);
                const qData = res.questions || [];

                if (!qData || qData.length < 20) {
                    console.warn(`Only ${qData.length} exam questions found. Need 20.`);
                }
                
                setQuestions(qData);
            } catch (err) {
                toast.error('Could not load the final challenge! Check your connection.')
                console.error('Final Exam Fetch Error:', err);
            } finally {
                setLoading(false)
            }
        }
        fetchQuestions()
    }, [courseId])

    useEffect(() => {
        if (!user?.id || !resolvedId) return;

        const checkCertificate = async () => {
            try {
                const { data: certData, error: certError } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('student_id', user.id)
                    .eq('course_id', resolvedId)
                    .maybeSingle();

                if (certData) {
                    setSubmitted(true);
                    setScore(20); // Bypass quiz and show certificate
                }
            } catch (err) {
                console.error('Error checking certificate:', err);
            }
        };

        checkCertificate();
    }, [user, resolvedId]);

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error(`Please answer all ${questions.length} questions before submitting!`)
            return
        }

        setActionLoading(true)
        try {
            // 1. Calculate Score (case-insensitive to support both 'a' and 'A' formats)
            const calculatedScore = questions.filter(q => answers[q.id]?.toLowerCase() === q.correct_answer?.toLowerCase()).length
            setScore(calculatedScore)
            setSubmitted(true)

            // 2. Passing requirement: 75% (15/20)
            if (calculatedScore >= 15 && questions.length >= 20) {
                // Call course completion API (updates DB and triggers email automation)
                await completeCourse(resolvedId)
                toast.success('CHALLENGE CONQUERED! You have earned your certificate! 🏆', { duration: 5000 })
            } else if (questions.length < 20) {
                toast.error('This exam is not yet ready for certification (Needs 20 questions).');
            } else {
                toast.error(`Brave attempt! You scored ${calculatedScore}/${questions.length}. You need 15/20 to pass.`, { duration: 5000 })
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err) {
            toast.error('Something went wrong with the submission. Please try again.')
            console.error('Exam Submit Error:', err);
        } finally {
            setActionLoading(false)
        }
    }

    const handleDownload = async () => {
        if (!certificateRef.current) return
        
        setActionLoading(true)
        try {
            // Wait a tiny bit for any state changes to settle
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const element = certificateRef.current
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            })
            
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })
            
            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`Certificate_${studentName.replace(/\s+/g, '_') || 'Character_Builder'}.pdf`)
            
            toast.success('Certificate downloaded successfully! 📄')
        } catch (err) {
            console.error('Download error:', err)
            toast.error('Could not generate PDF. Please try the Print option.')
        } finally {
            setActionLoading(false)
        }
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
                <h2 style={{ fontSize: 32, color: '#001F3F' }}>Final Exam Coming Soon!</h2>
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
                        <Trophy size={80} color="#FFD700" style={{ marginBottom: 20 }} className="animate-float" />
                        <h1 style={{ fontSize: 56, color: '#001F3F', fontWeight: '900', fontFamily: 'Fredoka', textShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>YOU DID IT!</h1>
                        <p style={{ fontSize: 20, color: '#64748b', marginTop: 10, fontFamily: 'Fredoka', fontWeight: 800 }}>You are officially a Character Builder!</p>

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

                        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 32 }} className="mobile-stack">
                            <button onClick={handlePrint} className="btn-primary" style={{ height: 60, padding: '0 32px', display: 'flex', alignItems: 'center', gap: 10, background: '#001F3F', borderRadius: 30, boxShadow: '0 6px 0 #000c1a' }}>
                                <Printer size={20} /> Print Certificate
                            </button>
                            <button 
                                onClick={handleDownload} 
                                disabled={actionLoading}
                                className="btn-primary" 
                                style={{ height: 60, padding: '0 32px', display: 'flex', alignItems: 'center', gap: 10, background: '#1DD1A1', borderRadius: 30, boxShadow: '0 6px 0 #10ac84' }}
                            >
                                {actionLoading ? <Loader2 className="spin" size={20} /> : <Download size={20} />}
                                {actionLoading ? 'Generating...' : 'Download Certificate'}
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
                                {course?.title || 'Character Builders: Essential Life Values for Kids'}
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

            <div style={{ background: '#001F3F', color: '#fff', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'rgba(0, 166, 192, 0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, right: -50, width: 250, height: 250, background: 'rgba(29, 209, 161, 0.15)', borderRadius: '50%' }} />
                <div className="section-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Trophy size={64} color="#FFD700" className="animate-float" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 42px)', fontWeight: '900', color: '#FFFFFF', marginBottom: 12, fontFamily: 'Fredoka', textShadow: '0 4px 0 rgba(0,0,0,0.15)' }}>
                            Final Moral Compass Challenge
                        </h1>
                        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', fontWeight: 700, maxWidth: 600, margin: '0 auto', fontFamily: 'Quicksand' }}>
                            Score at least 15/20 correctly to earn your certificate!
                        </p>
                    </div>
                </div>
            </div>

            <main className="section-container" style={{ maxWidth: 800, marginTop: 60 }}>
                {submitted && score < 15 && (
                    <div style={{ background: '#FFF5F5', border: '3px solid #FF6B6B', padding: 32, borderRadius: 24, textAlign: 'center', marginBottom: 40 }}>
                        <Heart size={48} color="#FF6B6B" style={{ marginBottom: 16 }} />
                        <h2 style={{ color: '#001F3F', fontSize: 24, fontWeight: 900 }}>Don't give up! You almost had it.</h2>
                        <p style={{ fontSize: 18, color: '#FF6B6B', marginTop: 8, fontWeight: 800 }}>You scored {score}/{questions.length} Correct</p>
                        <button
                            onClick={() => { setAnswers({}); setSubmitted(false); setScore(0); window.scrollTo(0, 0) }}
                            className="btn-primary"
                            style={{ background: '#00A6C0', marginTop: 24, height: 60, padding: '0 40px', borderRadius: 20 }}
                        >
                            <RefreshCcw size={20} style={{ marginRight: 10 }} /> Try The Challenge Again
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {questions.map((q, idx) => (
                        <div key={q.id} style={{ background: '#fff', padding: 40, borderRadius: 32, boxShadow: '0 10px 0 #F1F1F1', border: '3px solid #F1F1F1' }}>
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#00A6C0', color: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.1)' }}>
                                    {idx + 1}
                                </div>
                                <h3 style={{ fontSize: 20, color: '#001F3F', fontWeight: 900, lineHeight: 1.4, fontFamily: 'Fredoka' }}>{q.question}</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                                {['a', 'b', 'c', 'd'].map(opt => {
                                    const isSelected = answers[q.id] === opt
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                            style={{
                                                padding: '20px 24px',
                                                borderRadius: 16,
                                                border: isSelected ? '4px solid #00A6C0' : '3px solid #F1F1F1',
                                                background: isSelected ? '#E0F7FA' : '#fff',
                                                textAlign: 'left',
                                                fontSize: 16,
                                                fontWeight: 900,
                                                cursor: submitted ? 'default' : 'pointer',
                                                color: '#001F3F',
                                                fontFamily: 'Fredoka',
                                                boxShadow: isSelected ? '0 6px 0 #00A6C0' : '0 6px 0 #F1F1F1',
                                                transition: 'all 0.15s ease',
                                                position: 'relative',
                                                top: isSelected ? '2px' : '0px'
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
                            disabled={Object.keys(answers).length < questions.length || actionLoading}
                            className="btn-primary"
                            style={{
                                background: '#1DD1A1',
                                height: 80,
                                padding: '0 60px',
                                fontSize: 24,
                                borderRadius: 30,
                                boxShadow: '0 8px 0 #10ac84, 0 15px 30px rgba(29, 209, 161, 0.3)',
                                opacity: (Object.keys(answers).length < questions.length || actionLoading) ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                                color: '#fff',
                                fontWeight: 900,
                                fontFamily: 'Fredoka',
                                border: 'none',
                                position: 'relative',
                                top: 0
                            }}
                            onMouseEnter={e => { if (Object.keys(answers).length >= questions.length && !actionLoading) e.currentTarget.style.top = '-2px'; }}
                            onMouseLeave={e => { e.currentTarget.style.top = '0'; }}
                            onMouseDown={e => { if (Object.keys(answers).length >= questions.length && !actionLoading) e.currentTarget.style.top = '6px'; }}
                        >
                            {actionLoading ? <Loader2 className="spin" size={28} /> : null}
                            {actionLoading ? 'SUBMITTING...' : 'SUBMIT FINAL EXAM'}
                        </button>
                        <p style={{ marginTop: 24, color: '#888', fontWeight: 600, fontFamily: 'Quicksand' }}>Gather all your wisdom and send it to the heavens!</p>
                    </div>
                )}
            </main>
        </div>
    )
}
