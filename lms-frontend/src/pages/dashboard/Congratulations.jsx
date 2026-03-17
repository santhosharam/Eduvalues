import { useLocation, useParams, Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { Trophy, Mail, Download, Share2, CheckCircle, ArrowRight, Sparkles, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCourseById } from '../../services/courseService'
import api from '../../services/api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

export default function Congratulations() {
    const { courseId } = useParams()
    const { state } = useLocation()
    const [course, setCourse] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const result = state?.result

    useEffect(() => {
        getCourseById(courseId).then(res => setCourse(res.data.course))
        
        // Throw some confetti!
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval)
    }, [courseId])

    const handleDownload = async () => {
        if (!result?.certificateId) {
            toast.error('Certificate ID not found. Please check My Certificates page.')
            return
        }
        setDownloading(true)
        try {
            const response = await api.get(`/certificates/download/${result.certificateId}`, {
                responseType: 'blob',
            })
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `certificate-${course?.title || 'course'}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success('Certificate downloaded!')
        } catch {
            toast.error('Failed to download certificate')
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            <Navbar />
            
            <div className="relative pt-20 pb-32 px-4">
                {/* Decorative background elements */}
                <div className="absolute top-40 left-10 text-yellow-400/20 animate-pulse"><Sparkles size={120} /></div>
                <div className="absolute bottom-20 right-10 text-indigo-400/20 animate-pulse"><Trophy size={150} /></div>

                <div className="max-w-3xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-yellow-100 rounded-[40px] mb-8 animate-bounce">
                        <Trophy size={64} className="text-yellow-600" />
                    </div>

                    <h1 className="text-6xl font-black text-slate-900 mb-6 font-display leading-tight">
                        Wooohooo! <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            You're a Graduate!
                        </span>
                    </h1>

                    <p className="text-2xl text-slate-600 mb-12 font-bold max-w-2xl mx-auto leading-relaxed">
                        Amazing job! You've successfully navigated the full journey of <br/>
                        <span className="text-indigo-600">"{course?.title}"</span>.
                    </p>

                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-10 mb-12">
                        <div className="flex flex-col items-center gap-6">
                            <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl font-black text-lg">
                                <CheckCircle size={24} /> SCORE: {result?.score}/{result?.totalQuestions} ({result?.percentage.toFixed(0)}%)
                            </div>
                            
                            <div className="flex items-center gap-4 text-slate-500 font-bold">
                                <Mail className="text-indigo-500" /> 
                                <span className="text-xl">Check your email for the official certificate!</span>
                            </div>

                            <p className="text-slate-400 font-medium">It should arrive in your inbox within the next few minutes.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button 
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 disabled:opacity-50"
                        >
                            {downloading ? <Loader className="animate-spin" size={24} /> : <Download size={24} />} 
                            {downloading ? 'Generating...' : 'Download Certificate'}
                        </button>
                        
                        <Link 
                            to="/dashboard/my-courses" 
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-4 border-slate-100 hover:border-indigo-100 text-slate-600 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:-translate-y-1"
                        >
                            Back to My Journey <ArrowRight size={24} />
                        </Link>
                    </div>

                    <div className="mt-20 flex items-center justify-center gap-8 opacity-50">
                        <button className="flex items-center gap-2 font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                            <Share2 size={20} /> Share Success
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
