import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react'

import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Loader2 } from 'lucide-react'

export default function Blog() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/blogs')
            .then(res => {
                setBlogs(res.data.blogs || [])
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Failed to load insights. Please try again later.')
                setLoading(false)
            })
    }, [])
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7F9' }}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section style={{
                padding: '80px 24px 100px',
                textAlign: 'center',
                background: '#001F3F',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(0, 166, 192, 0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(29, 209, 161, 0.15)', borderRadius: '50%' }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        color: '#00A6C0',
                        fontWeight: 800,
                        fontSize: '14px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '16px'
                    }}>Insights & Stories</span>
                    <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, marginBottom: '24px' }}>EduValues Blog</h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '18px', lineHeight: 1.6 }}>
                        Dive into our collection of articles covering design, music, technology, and more.
                    </p>
                </div>


            </section>

            {/* --- BLOG LIST SECTION --- */}
            <main className="section-container" style={{ padding: '80px 24px', flex: 1 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="spin" size={48} color="#00A6C0" style={{ margin: '0 auto' }} />
                        <p style={{ marginTop: 16, color: '#666', fontWeight: 600 }}>Loading Insights...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#E74C3C' }}>
                        <p style={{ fontWeight: 600 }}>{error}</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', color: '#666' }}>
                        <p style={{ fontWeight: 600 }}>No insights available right now.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                        gap: '40px'
                    }}>
                        {blogs.map(post => (
                        <article key={post.id} style={{
                            background: '#fff',
                            borderRadius: '32px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            border: '1px solid #F1F1F1',
                            display: 'flex',
                            flexDirection: 'column'
                        }} className="blog-card"
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    background: '#00A6C0',
                                    color: '#fff',
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase'
                                }}>
                                    {post.category}
                                </div>
                            </div>

                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', color: '#888', fontSize: '11px', fontWeight: 800 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {post.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {post.readTime}</span>
                                </div>

                                <h2 style={{ fontSize: '20px', color: '#001F3F', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3, height: '52px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {post.title}
                                </h2>

                                <p style={{ color: '#666', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '20px', height: '64px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {post.excerpt}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #F4F7F9', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            borderRadius: '50%', 
                                            background: '#F1F1F1', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: '#00A6C0'
                                        }}>
                                            <User size={18} />
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#333' }}>{post.author}</span>
                                    </div>
                                    <Link to={`#`} style={{
                                        color: '#00A6C0',
                                        fontWeight: 900,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '13px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Read More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
