import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { getCourseBySlug } from '../../services/courseService'
import { initiatePayment, verifyPayment } from '../../services/paymentService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Shield, CreditCard, CheckCircle } from 'lucide-react'
import api from '../../services/api'

export default function Checkout() {
    const { courseId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get(`/courses/id/${courseId}`).then(r => setCourse(r.data.course)).catch(console.error)
    }, [courseId])

    const handlePayment = async () => {
        setLoading(true)
        try {
            const { data } = await initiatePayment(courseId)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.amount,
                currency: 'INR',
                name: 'LearnHub',
                description: course?.title,
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        await verifyPayment({ ...response, courseId })
                        toast.success('Payment successful! Enrolling you now...')
                        navigate('/payment/confirmation')
                    } catch {
                        toast.error('Payment verification failed')
                    }
                },
                prefill: { name: user?.name, email: user?.email },
                theme: { color: '#6366f1' },
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

    const finalPrice = course?.discountPrice || course?.price

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '60px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: 32, marginBottom: 40 }}>Checkout</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'start' }}>
                    {/* Order Summary */}
                    <div>
                        <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
                            {course && (
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <img src={course.thumbnail || `https://picsum.photos/seed/${course._id}/100/70`} alt="" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontSize: 15, marginBottom: 4 }}>{course.title}</h4>
                                        <p style={{ fontSize: 13, color: '#64748b' }}>by {course.instructor}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                                <span style={{ color: '#94a3b8' }}>Course Price</span>
                                <span>₹{course?.price}</span>
                            </div>
                            {course?.discountPrice && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                                    <span style={{ color: '#94a3b8' }}>Discount</span>
                                    <span style={{ color: '#10b981' }}>-₹{course.price - course.discountPrice}</span>
                                </div>
                            )}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                                <span>Total</span>
                                <span style={{ color: '#6366f1' }}>₹{finalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Action */}
                    <div className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <Shield size={20} color="#10b981" />
                            <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>Secure Payment</span>
                        </div>
                        <div style={{ display: 'flex', fontSize: 32, fontWeight: 900, color: '#6366f1', marginBottom: 8 }}>₹{finalPrice}</div>
                        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>One-time payment. Lifetime access.</p>
                        <button onClick={handlePayment} disabled={loading || !course} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }}>
                            <CreditCard size={18} /> {loading ? 'Processing...' : 'Pay with Razorpay'}
                        </button>
                        <ul style={{ marginTop: 20, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {['30-day money back guarantee', 'Instant course access', 'Certificate included'].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                                    <CheckCircle size={13} color="#10b981" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
