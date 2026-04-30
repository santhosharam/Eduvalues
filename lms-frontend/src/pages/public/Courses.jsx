import { useEffect, useState } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import CourseCard from '../../components/course/CourseCard'
import { getAllCourses } from '../../services/courseService'
import { Search, Filter, SlidersHorizontal, ArrowLeft, ArrowRight, Loader2, Smile, Rocket, Brain } from 'lucide-react'

export default function Courses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [levelFilter, setLevelFilter] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() => {
        setLoading(true)
        getAllCourses({
            search: searchTerm,
            level: levelFilter,
            category: categoryFilter
        })
            .then(res => {
                const fetchedCourses = res.data.courses || []
                setCourses(fetchedCourses)
                
                if (categories.length === 0) {
                    const uniqueCategories = [...new Set(fetchedCourses.map(c => c.category).filter(Boolean))]
                    setCategories(uniqueCategories)
                }
            })
            .finally(() => setLoading(false))
    }, [searchTerm, levelFilter, categoryFilter])

    return (
        <div style={{ minHeight: '100vh', background: '#F4F7F9', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* --- Header - Updated to Navy --- */}
            <div style={{
                background: '#001F3F',
                padding: '60px 24px 80px',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Blobs - Updated to Teal */}
                <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: 'rgba(0, 166, 192, 0.2)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, background: 'rgba(29, 209, 161, 0.15)', borderRadius: '50%' }} />

                <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: '#00A6C0',
                        padding: '10px 24px',
                        borderRadius: '30px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: '24px',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.05)'
                    }}>
                        <Rocket size={18} /> THE PLAYGROUND IS OPEN!
                    </div>
                    <h1 style={{ fontSize: '56px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>
                        Explore New Adventures
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: 600 }}>
                        Find the perfect playful journey for your little genius.
                    </p>
                </div>


            </div>

            <main className="section-container" style={{ padding: '80px 24px', flex: '1' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '320px 1fr',
                    gap: 40,
                    alignItems: 'start'
                }} className="courses-grid">

                    {/* Sidebar Filters - Updated to use Navy/Teal accents */}
                    <aside style={{
                        background: '#fff',
                        padding: '36px',
                        borderRadius: '32px',
                        border: '2px solid #F1F1F1',
                        position: 'sticky',
                        top: 120,
                        boxShadow: 'var(--shadow-soft)'
                    }}>
                        <h2 style={{ fontSize: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Filter size={24} color="#00A6C0" /> Filter Fun
                        </h2>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 12 }}>Search Adventure</label>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={18} />
                                <input
                                    type="text"
                                    placeholder="Find course..."
                                    className="input-field"
                                    style={{ paddingLeft: 46, height: '52px' }}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 12 }}>Skill Level</label>
                            <select
                                className="input-field"
                                style={{ background: 'none', height: '52px', fontWeight: 700, color: '#333' }}
                                value={levelFilter}
                                onChange={e => setLevelFilter(e.target.value)}>
                                <option value="">All Skills</option>
                                <option value="beginner">Beginner (3-6 yrs)</option>
                                <option value="intermediate">Intermediate (7-10 yrs)</option>
                                <option value="advanced">Expert (11+ yrs)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 12 }}>Category</label>
                            <select
                                className="input-field"
                                style={{ background: 'none', height: '52px', fontWeight: 700, color: '#333' }}
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}>
                                <option value="">All Playgrounds</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <button
                            className="btn-outline"
                            style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 14 }}
                            onClick={() => { setSearchTerm(''); setLevelFilter(''); setCategoryFilter('') }}>
                            Reset All
                        </button>
                    </aside>

                    {/* Main Content */}
                    <div>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                <Smile className="spin" size={64} color="#00A6C0" />
                                <p style={{ marginTop: 24, fontSize: 18, color: '#001F3F', fontWeight: 700 }}>Finding Adventures...</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 44, height: 44, background: 'rgba(0, 166, 192, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Brain size={24} color="#00A6C0" />
                                        </div>
                                        <span style={{ color: '#555', fontSize: 16, fontWeight: 700 }}><strong>{courses.length}</strong> Awesome Courses Found</span>
                                    </div>
                                </div>

                                {courses.length === 0 ? (
                                    <div style={{ background: '#fff', borderRadius: '32px', padding: 80, textAlign: 'center', border: '2px solid #F1F1F1' }}>
                                        <div style={{ fontSize: 64, marginBottom: 24 }}>🧭</div>
                                        <h3 style={{ fontSize: 24, marginBottom: 16, color: '#333' }}>Oh No! Adventure Not Found</h3>
                                        <p style={{ color: '#888', maxWidth: 400, margin: '0 auto 32px', fontSize: 16 }}>We couldn't find any courses matching those filters. Try adjusting your search!</p>
                                        <button className="btn-primary" onClick={() => { setSearchTerm(''); setLevelFilter(''); setCategoryFilter('') }}>Clear Filters</button>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                        gap: '32px'
                                    }}>
                                        {courses.map(course => <CourseCard key={course.id || course._id} course={course} />)}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <style>{`
                @media (max-width: 1024px) {
                    .courses-grid {
                        grid-template-columns: 1fr !important;
                    }
                    aside { 
                        position: static !important; 
                        margin-bottom: 40px;
                        box-shadow: none !important;
                    }
                    h1 { font-size: 42px !important; }
                }
            `}</style>
        </div>
    )
}
