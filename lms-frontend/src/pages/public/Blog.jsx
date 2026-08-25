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
                padding: '100px 24px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #001F3F 0%, #00366F 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(0, 166, 192, 0.1)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto' }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(0, 166, 192, 0.2)',
                        color: '#00A6C0',
                        fontWeight: 800,
                        fontSize: '13px',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        marginBottom: '24px'
                    }}>Insights & Stories</span>
                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>Insights & Stories</h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: 1.7, fontWeight: 500 }}>
                        Dive into our collection of articles covering design, music, technology, education and more.
                    </p>
                </div>
                
                {/* Subtle curve at bottom */}
                <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 3, pointerEvents: 'none' }}>
                    <svg viewBox="0 0 1440 48" style={{ fill: '#F4F7F9', width: '100%', height: 'auto', display: 'block' }}>
                        <path d="M0,48 L1440,48 L1440,16 Q720,-16 0,16 Z"></path>
                    </svg>
                </div>
            </section>

            {/* --- BLOG LIST SECTION --- */}
            <main className="section-container" style={{ padding: '60px 24px 100px', flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
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
                    <div className="insights-grid">
                        {blogs.map(post => (
                            <article key={post.id} className="insight-card">
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="insight-image-link">
                                    <div className="insight-image-wrapper">
                                        <img src={post.image} alt={post.title} />
                                    </div>
                                </a>

                                <div className="insight-content">
                                    <div className="insight-meta">
                                        <span className="insight-category">{post.category}</span>
                                        <span className="insight-date">
                                            <Calendar size={14} /> {post.date} • <Clock size={14} /> {post.readTime}
                                        </span>
                                    </div>

                                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="insight-title-link">
                                        <h2 className="insight-title">
                                            {post.title}
                                        </h2>
                                    </a>

                                    <p className="insight-excerpt">
                                        {post.excerpt}
                                    </p>

                                    <div className="insight-footer">
                                        <div className="insight-author">
                                            <span className="insight-author-avatar">
                                                <User size={18} />
                                            </span>
                                            <span className="insight-author-name">{post.author}</span>
                                        </div>
                                        <a href={post.url} target="_blank" rel="noopener noreferrer" className="insight-read-more">
                                            Read More <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            <style>{`
                .insights-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }
                .insight-card {
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid #F1F1F1;
                    display: flex;
                    flex-direction: row;
                    min-height: 280px;
                }
                .insight-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                }
                .insight-image-link {
                    flex: 0 0 45%;
                    display: block;
                    text-decoration: none;
                }
                .insight-image-wrapper {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .insight-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .insight-card:hover .insight-image-wrapper img {
                    transform: scale(1.05);
                }
                .insight-content {
                    flex: 0 0 55%;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                }
                .insight-meta {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }
                .insight-category {
                    background: rgba(0, 166, 192, 0.1);
                    color: #00A6C0;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .insight-date {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #888;
                    font-size: 13px;
                    font-weight: 600;
                }
                .insight-title-link {
                    text-decoration: none;
                    color: inherit;
                }
                .insight-title {
                    font-size: 28px;
                    color: #001F3F;
                    font-weight: 800;
                    margin-bottom: 16px;
                    line-height: 1.3;
                    transition: color 0.2s ease;
                }
                .insight-title-link:hover .insight-title {
                    color: #00A6C0;
                }
                .insight-excerpt {
                    color: #475569;
                    font-size: 15.5px;
                    line-height: 1.7;
                    margin-bottom: 24px;
                    flex-grow: 1;
                }
                .insight-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #F1F1F1;
                    padding-top: 24px;
                    margin-top: auto;
                }
                .insight-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .insight-author-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(0, 166, 192, 0.1);
                    color: #00A6C0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .insight-author-name {
                    font-size: 14px;
                    font-weight: 700;
                    color: #333;
                }
                .insight-read-more {
                    color: #00A6C0;
                    font-weight: 800;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: gap 0.2s ease;
                }
                .insight-read-more:hover {
                    gap: 10px;
                }
                
                @media (max-width: 1024px) {
                    .insight-card {
                        flex-direction: column;
                    }
                    .insight-image-link {
                        flex: none;
                        height: 300px;
                    }
                    .insight-content {
                        flex: none;
                        padding: 30px;
                    }
                    .insight-title {
                        font-size: 24px;
                    }
                }
                @media (max-width: 768px) {
                    .insight-content {
                        padding: 24px;
                    }
                    .insight-image-link {
                        height: 220px;
                    }
                    .insight-title {
                        font-size: 22px;
                    }
                    .insight-excerpt {
                        font-size: 15px;
                    }
                }
            `}</style>
        </div>
    )
}
