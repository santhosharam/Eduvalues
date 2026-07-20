import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { initiatePayment, verifyPayment } from '../../services/paymentService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Shield, CreditCard, CheckCircle, ArrowLeft, Rocket, Sparkles, Smile } from 'lucide-react'
import api from '../../services/api'

export default function Checkout() {
    const { courseId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        setPageLoading(true)
        api.get(`/courses/id/${courseId}`)
            .then(r => setCourse(r.data.course))
            .catch(err => {
                console.error(err)
                toast.error('Could not load adventure details.')
            })
            .finally(() => setPageLoading(false))
    }, [courseId])

    const handlePayment = async () => {
        if (!user) {
            toast.error('Please login first!')
            return
        }

        setLoading(true)
        try {
            const { data } = await initiatePayment(course.id || course._id)
            
            if (data.free) {
                toast.success('Welcome to the Adventure! 🎉')
                navigate('/payment/confirmation')
                return
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.amount,
                currency: 'INR',
                name: 'VE Value Education',
                description: `Enrollment: ${course.title}`,
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        await verifyPayment({ ...response, courseId: course.id || course._id })
                        toast.success('Welcome to the Adventure! 🎉')
                        navigate('/payment/confirmation')
                    } catch {
                        toast.error('Payment verification failed')
                    }
                },
                prefill: { 
                    name: user.name, 
                    email: user.email 
                },
                theme: { color: '#00A6C0' },
            }
            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'))
            rzp.open()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not initiate payment')
        } finally {
            setLoading(false)
        }
    }

    if (pageLoading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7F9' }}>
            <Smile className="spin" size={64} color="#00A6C0" />
        </div>
    )

    if (!course) return (
        <div style={{ minHeight: '100vh', background: '#F4F7F9' }}>
            <Navbar />
            <div style={{ padding: 100, textAlign: 'center' }}>
                <h2>Adventure Not Found!</h2>
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/courses')}>Back to Search</button>
            </div>
        </div>
    )

    const finalPrice = course.discount_price || course.discountPrice || course.price

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />
            
            <main className="section-container" style={{ flex: 1, padding: '60px 24px 100px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#888', fontWeight: 800, marginBottom: 32, cursor: 'pointer' }}
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0, 166, 192, 0.1)', color: '#00A6C0', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 800, marginBottom: 16 }}>
                        <Rocket size={16} /> SECURE ENROLLMENT
                    </div>
                    <h1 style={{ fontSize: 48, fontWeight: 900, color: '#001F3F' }}>Final Step to Adventure</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48, alignItems: 'start' }} className="mobile-stack">
                    {/* Left: Order Details */}
                    <div>
                        <div style={{ background: '#fff', padding: 40, borderRadius: '40px', border: '3px solid #F1F1F1', boxShadow: 'var(--shadow-soft)', marginBottom: 32 }}>
                            <h3 style={{ fontSize: 24, color: '#001F3F', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Sparkles size={24} color="#FF9F43" /> Adventure Details
                            </h3>
                            
                            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="mobile-stack">
                                <div style={{ width: 200, height: 130, borderRadius: '24px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={course.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 22, fontWeight: 800, color: '#333', marginBottom: 8 }}>{course.title}</h4>
                                    <p style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>{course.category} • Lifetime Access</p>
                                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                        <span style={{ background: '#F4F7F9', padding: '6px 12px', borderRadius: '10px', fontSize: 12, fontWeight: 800, color: '#555' }}>10+ Lessons</span>
                                        <span style={{ background: '#F4F7F9', padding: '6px 12px', borderRadius: '10px', fontSize: 12, fontWeight: 800, color: '#555' }}>Certificate</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: 40, borderRadius: '40px', border: '3px solid #F1F1F1' }}>
                            <h3 style={{ fontSize: 20, color: '#001F3F', marginBottom: 24 }}>What happens next?</h3>
                            <div style={{ display: 'grid', gap: 24 }}>
                                {[
                                    { t: 'Instant Access', d: 'Start your first lesson immediately after payment.', i: Rocket },
                                    { t: 'Lifetime Value', d: 'Your child can re-watch and learn at their own pace.', i: Sparkles },
                                    { t: 'Progress Tracking', d: 'Save progress and earn a unique certificate.', i: CheckCircle }
                                ].map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: '14px', background: '#F4F7F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <item.i size={20} color="#00A6C0" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, color: '#333', fontSize: 16 }}>{item.t}</div>
                                            <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{item.d}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Sidebar */}
                    <aside>
                        <div style={{ background: '#001F3F', padding: 48, borderRadius: '48px', color: '#fff', position: 'sticky', top: 120, boxShadow: '0 30px 60px rgba(0, 31, 63, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, background: 'rgba(29, 209, 161, 0.1)', color: '#1DD1A1', padding: '8px 16px', borderRadius: '30px', alignSelf: 'flex-start', width: 'fit-content' }}>
                                <Shield size={16} /> <span style={{ fontSize: 12, fontWeight: 800 }}>SECURE TRANSACTION</span>
                            </div>
                            
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 8 }}>Total Investment</div>
                                <div style={{ fontSize: 56, fontWeight: 900, color: '#fff' }}>₹{finalPrice}</div>
                                {(course.discount_price || course.discountPrice) && (
                                    <div style={{ fontSize: 14, color: '#1DD1A1', fontWeight: 700, marginTop: 4 }}>You saved ₹{course.price - (course.discount_price || course.discountPrice)}!</div>
                                )}
                            </div>

                            <button 
                                onClick={handlePayment} 
                                disabled={loading} 
                                className="btn-primary" 
                                style={{ width: '100%', height: 72, fontSize: 18, borderRadius: '24px', background: '#00A6C0', border: 'none', color: '#fff', boxShadow: '0 20px 40px rgba(0, 166, 192, 0.3)' }}
                            >
                                {loading ? <Smile className="spin" size={24} /> : <><CreditCard size={20} style={{ marginRight: 12 }} /> Pay with Razorpay</>}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 24, fontWeight: 600 }}>
                                By enrolling, you agree to our Terms of Adventure.
                            </p>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 32, paddingTop: 32, display: 'grid', gap: 16 }}>
                                {[
                                    '30-Day Happiness Guarantee',
                                    'Secure SSL Encryption',
                                    'Official VE Certificate'
                                ].map(text => (
                                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                                        <CheckCircle size={16} color="#1DD1A1" /> {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    )
}
