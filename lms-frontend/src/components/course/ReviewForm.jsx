import { useState } from 'react'
import { Star, Send, Loader2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ReviewForm({ courseId, onReviewSubmitted }) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [hover, setHover] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!comment.trim()) return toast.error('Please add a comment')
        
        setLoading(true)
        try {
            await api.post('/reviews', { courseId, rating, comment })
            toast.success('Review submitted! Thank you for your feedback.')
            setComment('')
            if (onReviewSubmitted) onReviewSubmitted()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not submit review')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ background: '#fff', padding: '32px', borderRadius: '32px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '2px solid #F1F1F1' }}>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#001F3F', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Star size={24} color="#F59E0B" fill="#F59E0B" /> Share Your Adventure!
            </h3>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 800, color: '#666' }}>How much did you enjoy this course?</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                <Star 
                                    size={36} 
                                    fill={(hover || rating) >= star ? "#F59E0B" : "none"} 
                                    color="#F59E0B"
                                    style={{ transition: 'transform 0.2s' }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 800, color: '#666' }}>Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell other students about your experience..."
                        style={{
                            width: '100%',
                            minHeight: '120px',
                            padding: '20px',
                            borderRadius: '20px',
                            border: '2px solid #F1F1F1',
                            fontSize: '16px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#00A6C0'}
                        onBlur={(e) => e.target.style.borderColor = '#F1F1F1'}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary" 
                    style={{ width: '100%', height: 60, borderRadius: 18, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
                >
                    {loading ? <Loader2 size={20} className="spin" /> : <><Send size={20} /> Submit Review</>}
                </button>
            </form>
        </div>
    )
}
