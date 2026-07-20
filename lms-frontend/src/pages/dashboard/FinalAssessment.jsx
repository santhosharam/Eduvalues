import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { getCourseById } from '../../services/courseService'
import { submitFinalAssessment } from '../../services/progressService'
import toast from 'react-hot-toast'
import { Sparkles, Brain, Trophy, ArrowRight, ShieldCheck, Timer } from 'lucide-react'

export default function FinalAssessment() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        getCourseById(courseId)
            .then(res => {
                setCourse(res.data.course)
                setLoading(false)
            })
            .catch(() => {
                toast.error('Failed to load assessment')
                setLoading(false)
            })
    }, [courseId])

    const handleOptionSelect = (questionIndex, optionIndex) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }))
    }

    const handleSubmit = async () => {
        if (!course?.finalQuiz) return
        
        if (Object.keys(answers).length < course.finalQuiz.length) {
            toast.error('Please answer all questions before submitting!')
            return
        }

        setSubmitting(true)
        try {
            const answerArray = Object.keys(answers).sort((a,b) => a-b).map(k => answers[k])
            const res = await submitFinalAssessment(courseId, answerArray)
            
            if (res.data.success) {
                toast.success('Congratulations! You passed!', { icon: '🎉' })
                navigate(`/dashboard/course/${courseId}/congratulations`, { state: { result: res.data } })
            } else {
                toast.error(`You scored ${res.data.percentage.toFixed(1)}%. Please try again to pass (70% required).`)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit assessment')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>

    if (!course || !course.finalQuiz || course.finalQuiz.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-gray-600 mb-4">No final assessment available for this course yet.</p>
                <Link to="/dashboard/my-courses" className="text-indigo-600 font-bold hover:underline">Back to Dashboard</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-slate-100 mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-4xl font-black mb-2 font-display">Final Journey Assessment</h1>
                        <p className="opacity-90 font-medium">Complete this final step to earn your certificate for "{course.title}"</p>
                    </div>

                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-wrap gap-6 justify-center">
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <Brain className="text-indigo-500" /> {course.finalQuiz.length} Questions
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <Trophy className="text-amber-500" /> 70% to Pass
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                            <Timer className="text-rose-500" /> No Time Limit
                        </div>
                    </div>

                    <div className="p-8 space-y-12">
                        {course.finalQuiz.map((q, qIdx) => (
                            <div key={qIdx} className="relative">
                                <span className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400">
                                    {qIdx + 1}
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 mb-6 pl-6">{q.question}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                    {q.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                            className={`p-5 rounded-2xl text-left transition-all border-2 font-bold ${
                                                answers[qIdx] === oIdx 
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                                            }`}
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
                        >
                            {submitting ? 'Verifying...' : <>Submit Assessment <ArrowRight /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
