import { useNavigate } from 'react-router-dom'
import { Star, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function CourseCard({ course }) {
    const navigate = useNavigate()
    const { user } = useAuth()
    if (!course) return null

    const isEnrolled = user?.enrolledCourses?.some(c => (c.id || c._id) === (course.id || course._id)) || user?.role === 'admin'
    const lessons = course.lessons || []
    const shortDescription = course.short_description || course.shortDescription || 'Nurturing integrity and leadership through play.'
    const discountPrice = course.discount_price || course.discountPrice
    const priceDisplay = course.price === 0 ? 'Free' : `₹${discountPrice || course.price}`
    const rating = course.rating || 0
    const reviewsCount = course.reviews?.length || 0

    const handleAction = (e) => {
        e.stopPropagation()
        if (isEnrolled) {
            if (lessons.length > 0) {
                const lessonId = lessons[0].id || lessons[0]._id
                navigate(`/dashboard/lesson/${lessonId}`)
            } else {
                navigate(`/courses/${course.slug || course.id || course._id}`)
            }
        } else {
            navigate(`/courses/${course.slug || course.id || course._id}`)
        }
    }

    return (
        <div className="kids-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => navigate(`/courses/${course.slug || course.id || course._id}`)}>
            {/* Image Section */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#00A6C0',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {course.category || 'Values'}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '20px',
                    color: '#001F3F',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                    minHeight: '52px',
                    fontFamily: '"Fredoka", sans-serif',
                    fontWeight: '900'
                }}>
                    {course.title}
                </h3>

                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {shortDescription}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < Math.floor(rating) ? "#F59E0B" : "none"}
                                color="#F59E0B"
                            />
                        ))}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>{rating}</span>
                    <span style={{ fontSize: '13px', color: '#888' }}>({reviewsCount} reviews)</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid #F1F1F1' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#001F3F' }}>
                        {priceDisplay}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className="btn-outline" 
                            style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '20px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/${course.slug || course.id || course._id}`);
                            }}
                        >
                            Details
                        </button>
                        <button
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '20px', display: 'flex', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                            onClick={handleAction}
                        >
                            {isEnrolled ? 'Start Now' : 'Enroll Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
