import { Link } from 'react-router-dom'
import { User, Star, Clock, Users, BookOpen, MapPin, Globe } from 'lucide-react'

export default function CourseCard({ course }) {
    if (!course) return null

    // Data formatting based on the mock-up image
    const priceDisplay = course.price === 0 ? 'Free' : `₹${(course.discountPrice || course.price).toFixed(2)}`
    const duration = course.duration || '0m'
    const studentCount = course.enrolledCount || 7
    const moduleCount = course.lessons?.length || 50
    const authorMail = course.instructor || 'eduvaluesin@gmail.com'
    const rating = 4.5
    const reviews = 2
    const level = course.level || 'Beginner'

    return (
        <div
            className="course-list-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                padding: '24px',
                gap: '32px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s',
                marginBottom: '20px'
            }}
        >
            {/* Left Image Box */}
            <div className="card-image-wrapper" style={{
                width: '200px',
                height: '200px',
                background: '#EEF2FF',
                borderRadius: '12px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#2ECC71',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    zIndex: 2
                }}>
                    {level}
                </div>

                {/* Fallback Icon */}
                <BookOpen size={48} color="#A5B4FC" opacity={0.6} style={{ zIndex: 1 }} />

                {/* Real Image if uploaded */}
                {course.thumbnail && (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1
                        }}
                    />
                )}
            </div>

            {/* Middle Content */}
            <div className="card-middle-content" style={{ flex: 1 }}>
                <h3 style={{
                    fontSize: '20px',
                    color: '#1e293b',
                    fontWeight: 800,
                    marginBottom: '16px',
                    lineHeight: 1.4
                }}>
                    {course.title || 'The Kindness Garden ??? Learning How Small Acts Grow Big'}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' }}>
                        <User size={16} color="#F59E0B" />
                        <span>{authorMail}</span>
                    </div>
                    <div style={{
                        background: '#2ECC71',
                        color: '#fff',
                        padding: '2px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 600
                    }}>
                        {level}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '14px' }}>
                        <Star size={16} fill="#F59E0B" color="#F59E0B" />
                        <span>{rating} ({reviews})</span>
                    </div>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', width: '100%', margin: '0 0 20px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                        <Clock size={16} />
                        {duration}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                        <Users size={16} />
                        {studentCount}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                        <BookOpen size={16} />
                        {moduleCount}
                    </div>
                </div>
            </div>

            {/* Right Action Area */}
            <div className="card-right-action" style={{
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid #f1f5f9',
                paddingLeft: '32px',
                flexShrink: 0
            }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
                    {priceDisplay}
                </div>
                <Link to={`/courses/${course.slug || course._id}`} style={{ textDecoration: 'none', width: '100%' }}>
                    <button style={{
                        width: '100%',
                        background: '#3B82F6',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '25px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        Buy Now
                    </button>
                </Link>
            </div>

            <style jsx>{`
                .course-list-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
                }
                @media (max-width: 900px) {
                    .course-list-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 20px !important;
                    }
                    .card-image-wrapper {
                        width: 100% !important;
                        height: 200px !important;
                    }
                    .card-right-action {
                        width: 100% !important;
                        border-left: none !important;
                        padding-left: 0 !important;
                        border-top: 1px solid #f1f5f9;
                        padding-top: 20px;
                        flex-direction: row !important;
                        justify-content: space-between !important;
                    }
                    .card-right-action div {
                        margin-bottom: 0 !important;
                    }
                    .card-right-action a {
                        width: auto !important;
                    }
                }
            `}</style>
        </div>
    )
}
