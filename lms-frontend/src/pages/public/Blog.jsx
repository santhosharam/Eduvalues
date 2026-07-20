import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react'

// Real blog data from eduvalues.in
const BLOG_POSTS = [
    {
        id: 'insight-1',
        title: "The Future of Personalized Learning: How Technology is Shaping Value-Based Education",
        excerpt: "Exploring how modern educational tools are no longer just about information transfer, but about cultivating character, integrity, and empathy in the digital generation. We delve into the intersection of technology and ethics.",
        image: "/blog/insight-personal-learning.png",
        author: "EduValues Insight Team",
        date: "March 31, 2024",
        category: "EdTech Insights",
        readTime: "10 min read"
    },
    {
        id: 'insight-2',
        title: "Beyond Academic Success: Why 'Human Values' Are the Most Needed Skill of 2024",
        excerpt: "In an era dominated by AI and automation, certain human traits remain irreplaceable. We dive into why empathy, ethics, and critical thinking are becoming the cornerstone of the global workforce.",
        image: "/blog/insight-human-values.png",
        author: "EduValues Insight Team",
        date: "March 28, 2024",
        category: "Global Education",
        readTime: "8 min read"
    },
    {
        id: 1,
        title: "What are the easy dance form to learn for beginners?",
        excerpt: "Learn about the most accessible dance styles for those just starting their journey into the world of movement and music.",
        image: "/blog/dance.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Dance",
        readTime: "6 min read"
    },
    {
        id: 2,
        title: "Most essential UX design principle for new comers.",
        excerpt: "Understanding the core principles of User Experience design is crucial for any beginner entering the tech industry.",
        image: "/blog/ux-ui.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "UX/UI Design",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "10 most easy steps to master chord progression in guitar.",
        excerpt: "A step-by-step guide to understanding and playing beautiful chord sequences on your guitar.",
        image: "/blog/music.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Music",
        readTime: "8 min read"
    },
    {
        id: 4,
        title: "What is photoshop and what is it used for?",
        excerpt: "A comprehensive look at Adobe Photoshop and its role in modern graphic design and photo editing.",
        image: "/blog/graphic-design.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Graphic Designing",
        readTime: "5 min read"
    },
    {
        id: 5,
        title: "How to become Social Media Manager in 11 steps?",
        excerpt: "Your roadmap to building a successful career managing social media presence for brands and businesses.",
        image: "/blog/social-media.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Marketing",
        readTime: "9 min read"
    },
    {
        id: 6,
        title: "Character sketch examples for creative writing.",
        excerpt: "Learn how to breathe life into your fictional characters with detailed and vivid character sketches.",
        image: "/blog/creative-writing.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Creative Writing",
        readTime: "6 min read"
    },
    {
        id: 7,
        title: "The importance of Information Technology – Why is it so important?",
        excerpt: "Discover why IT is the backbone of modern society and how it impacts our daily lives and global economy.",
        image: "/blog/it-tech.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Information Technology",
        readTime: "7 min read"
    },
    {
        id: 8,
        title: "Is creativity most valuable skill for designer?",
        excerpt: "Exploring the debate on whether raw creativity or technical skill is more important in the design world.",
        image: "/blog/design-thinking.png",
        author: "EduValues Team",
        date: "October 8, 2021",
        category: "Design",
        readTime: "5 min read"
    }
]

export default function Blog() {
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
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                    gap: '40px'
                }}>
                    {BLOG_POSTS.map(post => (
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
            </main>

            <Footer />
        </div>
    )
}
