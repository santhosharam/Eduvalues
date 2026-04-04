import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { getLessonById, getLessonsByCourseId } from '../../services/lessonService'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { CheckCircle, FileText, ArrowLeft, Sparkles, Heart, Rocket, Brain, Trophy, Lock, PlayCircle, BookOpen, Star, Shield, Compass, Smile } from 'lucide-react'
import { supabase } from '../../supabaseClient'

import ComicViewer from '../../components/lesson/ComicViewer'

export default function LessonPage() {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [nextLessonId, setNextLessonId] = useState(null)
    const [isLastLesson, setIsLastLesson] = useState(false)
    const [quizQuestions, setQuizQuestions] = useState([])
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [quizPassed, setQuizPassed] = useState(false)
    const [allCourseLessons, setAllCourseLessons] = useState([])
    const [activeTab, setActiveTab] = useState('content')
    const [completedLessons, setCompletedLessons] = useState(() => {
        const saved = localStorage.getItem('completedLessons')
        return saved ? JSON.parse(saved) : []
    })

    const kindnessStoryPanels = [
        {
            image: '/kindness/lesson1/panel1.png',
            caption: 'In a small neighborhood, Maya spotted elderly Mr. Jenkins sitting sadly on his porch. His once vibrant garden — full of colorful flowers — was now overgrown with weeds. "My beautiful garden... it\'s all gone," he sighed. Maya felt her heart sink seeing him so sad.'
        },
        {
            image: '/kindness/lesson1/panel2.png',
            caption: 'Maya decided to help. Every day after school, she spent time pulling weeds and planting new flowers in Mr. Jenkins\' garden. She never gave up, even when it was hard work!'
        },
        {
            image: '/kindness/lesson1/panel3.png',
            caption: '"Don\'t worry Mr. Jenkins! I will fix your garden!" Maya rolled up her sleeves with a big determined smile. Small acts of kindness — like planting seeds — can grow into something truly beautiful!'
        },
        {
            image: '/kindness/lesson1/panel4.png',
            caption: 'Other neighborhood children saw what Maya was doing and joined her. Soon they were not only helping Mr. Jenkins — but also other neighbors who needed help with their gardens too!'
        },
        {
            image: '/kindness/lesson1/panel5.png',
            caption: 'As they worked together, the entire neighborhood started to bloom — not just with flowers, but with friendship and joy! Maya realized that acts of kindness, like seeds, grow into beautiful things when planted and nurtured. 🌸'
        },
        {
            image: '/kindness/lesson1/panel6.png',
            caption: '🌟 What You Will Learn:\n\n• How small acts of kindness make a big difference\n• Why being kind helps others AND makes you feel good too\n• Creative ways to show kindness every day\n\n💛 Remember:\nKindness means being friendly, generous and considerate to others. It\'s about treating people with care and respect — and doing nice things without expecting anything in return!'
        }
    ]

    const honestyPanels = [
        {
            image: '/kindness/lesson2/panel1.png',
            caption: 'Alex was home alone feeling bored. He spotted his ball and thought "Mom said no ball inside... but just once won\'t hurt!" He tossed it high with a big excited smile.'
        },
        {
            image: '/kindness/lesson2/panel2.png',
            caption: 'CRASH! SHATTER! The ball bounced off the ceiling and knocked Mom\'s favorite vase straight off the shelf! Alex froze in horror. "Oh no...!!" Broken pieces were everywhere on the floor.'
        },
        {
            image: '/kindness/lesson2/panel3.png',
            caption: 'Alex knelt by the broken pieces feeling terrible. A tiny devil whispered "Just hide it! Say the cat did it!" But a tiny angel replied "Tell the truth! Be honest!" Alex felt torn inside.'
        },
        {
            image: '/kindness/lesson2/panel4.png',
            caption: 'Alex stood alone at the front door waiting for Mom to come home. His fists were clenched with courage. "I have to tell the truth... even if it\'s scary," he thought bravely.'
        },
        {
            image: '/kindness/lesson2/panel5.png',
            caption: '"Mom... I broke your special vase. I was playing ball inside. I am really sorry." Mom was quiet for a moment — then hugged him warmly. "I am sad about my vase... but I am SO proud of you for telling the truth. That was brave!"'
        },
        {
            image: '/kindness/lesson2/panel6.png',
            caption: 'Together they cleaned up the pieces. Alex used his allowance to help buy a new vase and couldn\'t play ball for a week. But he felt good inside. "Even though I got in trouble... telling the truth felt RIGHT! 🌟 Honesty builds TRUST!"'
        }
    ]

    const responsibilityPanels = [
        {
            image: '/kindness/lesson3/panel1.png',
            caption: 'Riya jumped for joy when her coach handed her the captain\'s armband! "Riya! You are our new team captain!" "YES! I won\'t let you down!" Her teammates cheered around her on the sunny soccer field.'
        },
        {
            image: '/kindness/lesson3/panel2.png',
            caption: 'But on game day morning, Riya\'s alarm rang early. She sleepily reached out and hit SNOOZE. "Just five more minutes..." she mumbled, pulling her blanket back over her head.'
        },
        {
            image: '/kindness/lesson3/panel3.png',
            caption: 'Riya arrived late. Coach looked disappointed. "Riya... we had to start without you." The team rushed through warm-ups and lost the game. "This is my fault," Riya thought sadly.'
        },
        {
            image: '/kindness/lesson3/panel4.png',
            caption: 'That night Riya sat at her desk and set her alarm with determination. She stuck a note on the wall: "BE RESPONSIBLE — ARRIVE EARLY!" "Next week will be different. I promise," she thought.'
        },
        {
            image: '/kindness/lesson3/panel5.png',
            caption: 'The next week Riya arrived FIRST! She set up the cones, led the warm-ups and cheered for everyone. "Good morning everyone! Let\'s warm up together!" "Wow Riya is already here!" a teammate said happily.'
        },
        {
            image: '/kindness/lesson3/panel6.png',
            caption: 'After the game Coach knelt down proudly. "Great leadership today Riya! Your responsibility made a difference for the whole team!" Riya smiled — "Being responsible means being someone others can COUNT ON! 🌟 Responsibility builds TRUST!"'
        }
    ]
    const respectPanels = [
        {
            image: '/kindness/lesson4/panel1.png',
            caption: 'Ms. Gracy smiled warmly at the class. "Everyone please welcome our new student Mei!" Mei stood nervously at the door in her traditional clothing. Some kids whispered and giggled. "She dresses so differently..." Mei felt very uncomfortable.'
        },
        {
            image: '/kindness/lesson4/panel2.png',
            caption: 'At lunch Mei sat completely alone, carefully opening her containers of dumplings. Suddenly a rude boy pointed loudly. "Eww! What IS that?!" Mei looked down at her food, her cheeks turning red with embarrassment.'
        },
        {
            image: '/kindness/lesson4/panel3.png',
            caption: 'Across the cafeteria Zach watched Mei with a concerned heart. He remembered his own first day at a new school — how lonely and scared he felt. "I remember how that felt... being the new kid. I have to do something."'
        },
        {
            image: '/kindness/lesson4/panel4.png',
            caption: 'Zach took a deep breath and walked over to Mei\'s table with a warm smile. "Hi! I am Zach. Can I sit with you?" Mei looked up surprised. "That food smells really good! What is it?" Mei began to smile shyly for the first time.'
        },
        {
            image: '/kindness/lesson4/panel5.png',
            caption: 'Soon more friends joined them at lunch! "These dumplings are AMAZING!" Zach exclaimed. Within a week Mei was running and laughing with the whole friend group on the playground — no longer alone!'
        },
        {
            image: '/kindness/lesson4/panel6.png',
            caption: '"Thank you for being kind to me that first day Zach," Mei said warmly as they walked together. Zach smiled. "Everyone deserves to be treated with RESPECT!" 🌟 The End — Respect connects us all!'
        }
    ]

    useEffect(() => {
        setLoading(true)
        getLessonById(lessonId)
            .then(async res => {
                const lessonData = res.data.lesson
                setLesson(lessonData)
                console.log('Lesson loaded:', lessonData)

                // Fetch lesson quiz questions from Supabase
                const { data: quizData, error: quizError } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('lesson_id', lessonId)
                    .eq('is_final_exam', false)
                    .order('order_index', { ascending: true })

                console.log('Quiz data:', quizData)
                setQuizQuestions(quizData || [])
            })
            .catch((err) => {
                toast.error('Could not load adventure!')
                console.error(err)
            })
            .finally(() => setLoading(false))
    }, [lessonId])

    useEffect(() => {
        if (lesson?.course_id) {
            getLessonsByCourseId(lesson.course_id)
                .then(res => {
                    const lessons = res.data.lessons
                    console.log('Curriculum fetched:', lessons)
                    setAllCourseLessons(lessons)
                    const currentIndex = lessons.findIndex(l => String(l._id) === String(lessonId))
                    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
                        setNextLessonId(lessons[currentIndex + 1].id || lessons[currentIndex + 1]._id)
                        setIsLastLesson(false)
                    } else {
                        setNextLessonId(null)
                        setIsLastLesson(true)
                    }
                })
        }
    }, [lesson, lessonId])

    useEffect(() => {
        if (lessonId && completedLessons.includes(String(lessonId))) {
            setQuizPassed(true)
        } else {
            setQuizPassed(false)
        }
    }, [lessonId, completedLessons])

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(0,166,192,0.2)', borderTop: '3px solid #00A6C0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
    )

    if (!lesson) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#64748b' }}>Lesson not found.</p>
            <Link to="/dashboard/my-courses" className="btn-secondary">← Back to My Courses</Link>
        </div>
    )

    const safeContent = lesson.content ? DOMPurify.sanitize(lesson.content) : null

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFB' }}>
            {/* Sidebar (Desktop) */}
            <aside className="lesson-sidebar" style={{
                width: 320,
                background: '#fff',
                borderRight: '2px solid #F1F1F1',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                overflowY: 'auto',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '32px 24px', borderBottom: '2px solid #F8FAFB' }}>
                    <div onClick={() => navigate('/courses')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', marginBottom: 20, fontSize: 13, fontWeight: 700 }}>
                        <ArrowLeft size={16} /> EXIT COURSE
                    </div>
                    {/* Character Builders Curriculum Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ width: 40, height: 40, background: '#00A6C0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <BookOpen size={20} />
                        </div>
                        <h2 style={{ fontSize: 18, color: '#001F3F', fontWeight: 900, lineHeight: 1.2 }}>Character Builders curriculum</h2>
                    </div>
                </div>

                <div style={{ flex: 1, padding: 12 }}>
                    {allCourseLessons.map((l, idx) => {
                        const isCurrent = String(l._id) === String(lessonId)
                        const isCompleted = completedLessons.includes(String(l._id))
                        // Unlock logic: lesson 1 is always unlocked. n is unlocked if n-1 is completed.
                        const isUnlocked = idx === 0 || completedLessons.includes(String(allCourseLessons[idx - 1]?._id))
                        
                        return (
                            <div 
                                key={l._id}
                                onClick={() => isUnlocked && navigate(`/dashboard/lesson/${l._id}`)}
                                style={{
                                    padding: '16px 20px',
                                    borderRadius: 16,
                                    marginBottom: 8,
                                    cursor: isUnlocked ? 'pointer' : 'default',
                                    background: isCurrent ? '#E0F7FA' : isUnlocked ? 'transparent' : '#f8fafb',
                                    border: isCurrent ? '2px solid #00A6C0' : '2px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    opacity: isUnlocked ? 1 : 0.6,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: 10, 
                                    background: isCompleted ? '#1DD1A1' : isCurrent ? '#00A6C0' : '#f1f1f1',
                                    color: isCompleted || isCurrent ? '#fff' : '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 900
                                }}>
                                    {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: isCurrent ? '#001F3F' : '#64748b' }}>{l.title}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginTop: 2 }}>
                                        {isCurrent ? 'Viewing' : isCompleted ? 'Completed' : isUnlocked ? 'Next Adventure' : 'Locked'}
                                    </div>
                                </div>
                                {!isUnlocked && <Lock size={14} color="#ccc" />}
                                {isCurrent && <PlayCircle size={14} color="#00A6C0" />}
                            </div>
                        )
                    })}
                </div>

                <div style={{ padding: 24, background: '#F8FAFB', borderTop: '2px solid #F1F1F1' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00A6C0', marginBottom: 8, textAlign: 'center' }}>CURRICULUM PROGRESS</div>
                    <div style={{ width: '100%', height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${(completedLessons.length / (allCourseLessons.length || 1)) * 100}%`, height: '100%', background: '#1DD1A1', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginTop: 8, textAlign: 'center' }}>
                        {completedLessons.length} / {allCourseLessons.length} Completed
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: 320, transition: 'margin-left 0.3s' }} className="main-content-layout">
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFB', position: 'relative', overflow: 'hidden' }}>
                    <Navbar />

                    {/* Top Progress Bar (Mobile) */}
                    <div className="mobile-progress-bar" style={{ display: 'none', height: 6, background: '#eee', width: '100%', position: 'sticky', top: 0, zIndex: 50 }}>
                        <div style={{ 
                            height: '100%', 
                            width: `${(completedLessons.length / (allCourseLessons.length || 1)) * 100}%`, 
                            background: 'linear-gradient(to right, #1DD1A1, #00A6C0)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>

                    <div style={{ flex: 1, padding: '40px 24px', maxWidth: 900, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                background: '#fff',
                                borderRadius: '24px',
                                marginBottom: 24,
                                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                                transform: 'rotate(-5deg)'
                            }}>
                                <Brain size={40} color="#00A6C0" />
                            </div>
                            <h1 style={{ fontSize: 'clamp(32px, 6vw, 42px)', fontWeight: 900, color: '#001F3F', fontFamily: '"Fredoka", sans-serif', marginBottom: 16 }}>{lesson.title} Adventure</h1>
                        </div>

                        {/* --- Lesson Tabs Structure --- */}
                        <div style={{ background: '#fff', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '2px solid #F1F1F1', marginBottom: 40, overflow: 'hidden' }}>
                            {/* Tab Switcher */}
                            <div style={{ display: 'flex', background: '#F8FAFB', borderBottom: '2px solid #F1F1F1' }}>
                                {[                                    {id: 'content', label: 'Reading Time', icon: BookOpen, color: '#00A6C0'},
                                    {id: 'summary', label: 'Quick Summary', icon: Rocket, color: '#FF9F43'},
                                    {id: 'moral', label: 'Moral Value', icon: Heart, color: '#FF6B6B'},
                                    ...(quizQuestions.length > 0 ? [{id: 'quiz', label: 'Brain Challenge', icon: Trophy, color: '#1DD1A1'}] : [])
                                ].map((t, idx) => {
                                    const isActive = activeTab === t.id
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id)}
                                            style={{
                                                flex: 1,
                                                padding: '24px 12px',
                                                border: 'none',
                                                background: isActive ? '#fff' : 'transparent',
                                                borderBottom: isActive ? `4px solid ${t.color}` : '4px solid transparent',
                                                color: isActive ? t.color : '#888',
                                                fontSize: 16,
                                                fontWeight: 900,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 8,
                                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                            }}
                                        >
                                            <t.icon size={24} color={isActive ? t.color : '#aaa'} />
                                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 900 }}>{t.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Tab Content Area */}
                            <div style={{ padding: '60px 40px', minHeight: 450 }}>
                                {activeTab === 'content' && (
                                    <div className="animate-fade-in" style={{ position: 'relative' }}>
                                        {/* Character Avatar */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                                            <div style={{ 
                                                width: 80, 
                                                height: 80, 
                                                background: '#00A6C0', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                border: '4px solid #fff',
                                                boxShadow: '0 10px 20px rgba(0, 166, 192, 0.2)',
                                                flexShrink: 0
                                            }}>
                                                <Smile size={48} color="#fff" strokeWidth={2.5} />
                                            </div>
                                            <div style={{ background: '#001F3F', color: '#fff', padding: '12px 24px', borderRadius: '20px', fontSize: 14, fontWeight: 900, position: 'relative' }}>
                                                LISTEN TO THE STORY!
                                                <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid #001F3F' }} />
                                            </div>
                                        </div>

                                        {/* Comic Viewer logic */}
                                        <div style={{ position: 'relative' }}>
                                            {String(lessonId) === '11111111-0000-0000-0000-000000000001' ? (
                                                <ComicViewer panels={kindnessStoryPanels} />
                                            ) : String(lessonId) === '11111111-0000-0000-0000-000000000002' ? (
                                                <ComicViewer panels={honestyPanels} />
                                            ) : String(lessonId) === '11111111-0000-0000-0000-000000000003' ? (
                                                <ComicViewer panels={responsibilityPanels} />
                                            ) : String(lessonId) === '11111111-0000-0000-0000-000000000004' ? (
                                                <ComicViewer panels={respectPanels} />
                                            ) : (
                                                <div className="story-mode" style={{ 
                                                    fontSize: 22, 
                                                    lineHeight: 1.8, 
                                                    color: '#001F3F', 
                                                    fontFamily: '"Fredoka", sans-serif',
                                                    fontWeight: 500 
                                                }}>
                                                    {safeContent ? (
                                                        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
                                                    ) : (
                                                        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                                                            Waiting for the adventure to unfold...
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Comic Highlights - only for non-comic viewer mode or decorative */}
                                            {![
                                                '11111111-0000-0000-0000-000000000001',
                                                '11111111-0000-0000-0000-000000000002',
                                                '11111111-0000-0000-0000-000000000003',
                                                '11111111-0000-0000-0000-000000000004'
                                            ].includes(String(lessonId)) && (
                                                <>
                                                    <div style={{ position: 'absolute', top: -20, right: 40, background: '#FFD700', color: '#000', padding: '8px 20px', borderRadius: '10px', fontWeight: 900, fontSize: 18, transform: 'rotate(5deg)', border: '3px solid #000' }}>
                                                        WOW! 🌟
                                                    </div>
                                                    <div style={{ position: 'absolute', bottom: -15, left: 60, background: '#1DD1A1', color: '#fff', padding: '6px 16px', borderRadius: '10px', fontWeight: 900, fontSize: 14, transform: 'rotate(-3deg)', border: '3px solid #001F3F' }}>
                                                        STORY TIME
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'summary' && (
                                    <div className="animate-fade-in">
                                        <h3 style={{ fontSize: 28, color: '#FF9F43', marginBottom: 32, fontWeight: 900 }}>Top 3 Lessons! 🌟</h3>
                                        <div style={{ display: 'grid', gap: 24 }}>
                                            {[
                                                { title: "Believe in Yourself", desc: "No matter how small you feel, you have great power within!", icon: Star },
                                                { title: "Stay Brave", desc: "True courage is being kind even when it's hard.", icon: Shield },
                                                { title: "Keep Exploring", desc: "Every adventure teaches us something new and wonderful.", icon: Compass }
                                            ].map((item, i) => (
                                                <div key={i} style={{ display: 'flex', gap: 20, background: '#FFF9F1', padding: 24, borderRadius: 24, border: '2px solid #FFE8CC' }}>
                                                    <div style={{ width: 56, height: 56, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(255, 159, 67, 0.15)' }}>
                                                        <item.icon size={28} color="#FF9F43" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 18, fontWeight: 900, color: '#001F3F', marginBottom: 4 }}>{item.title}</div>
                                                        <div style={{ fontSize: 15, color: '#666', fontWeight: 600 }}>{item.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'moral' && (
                                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <div style={{ 
                                            width: 140, 
                                            height: 140, 
                                            background: '#FFF0F0', 
                                            borderRadius: '50%', 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            marginBottom: 32,
                                            animation: 'pulse 3s infinite'
                                        }}>
                                            <Heart size={80} color="#FF6B6B" fill="#FF6B6B" />
                                        </div>
                                        <h3 style={{ fontSize: 32, color: '#FF6B6B', fontWeight: 900, marginBottom: 20 }}>The Magic Word: KINDNESS</h3>
                                        <p style={{ fontSize: 18, color: '#444', maxWidth: 600, margin: '0 auto', lineHeight: 1.8, fontWeight: 600 }}>
                                            In this adventure, we learned that small acts of love can light up the entire world. 
                                            Remember to be the spark of kindness in someone's day!
                                        </p>
                                        <div style={{ marginTop: 40, padding: '20px 32px', background: '#F8FAFB', borderRadius: 20, display: 'inline-flex', gap: 12, alignItems: 'center', fontWeight: 800, color: '#001F3F' }}>
                                            <Sparkles size={24} color="#FFD700" /> MISSION: Help a friend today!
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'quiz' && (
                                    <div className="animate-fade-in">
                                        <h3 style={{ fontSize: 28, color: '#1DD1A1', marginBottom: 40, fontWeight: 900 }}>Brain Challenge 🎮</h3>
                                        {quizPassed ? (
                                            <div style={{ textAlign: 'center', padding: 60, background: '#E8FDF5', borderRadius: 40, border: '4px solid #1DD1A1' }}>
                                                <Trophy size={80} color="#1DD1A1" style={{ marginBottom: 24 }} />
                                                <h4 style={{ fontSize: 32, color: '#001F3F', fontWeight: 900 }}>You're a Legend!</h4>
                                                <p style={{ fontSize: 18, color: '#666', marginTop: 12, fontWeight: 700 }}>You have conquered this challenge and opened the next map! 🧭</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gap: 40 }}>
                                                {quizQuestions.map((q, idx) => (
                                                    <div key={q.id} style={{ background: '#F4F7F9', padding: '40px', borderRadius: '32px', border: '2px solid #EEE' }}>
                                                        <h4 style={{ fontSize: 22, fontWeight: 900, color: '#001F3F', marginBottom: 24, lineHeight: 1.4 }}>{idx + 1}. {q.question}</h4>
                                                        <div style={{ display: 'grid', gap: 16 }}>
                                                            {['a', 'b', 'c', 'd'].map(opt => {
                                                                const isSelected = quizAnswers[q.id] === opt
                                                                const isCorrect = quizSubmitted && opt === q.correct_answer
                                                                const isWrong = quizSubmitted && isSelected && opt !== q.correct_answer
                                                                return (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                                        style={{
                                                                            padding: '24px 32px',
                                                                            borderRadius: 20,
                                                                            border: isCorrect ? '4px solid #1DD1A1' : isWrong ? '4px solid #FF6B6B' : isSelected ? '4px solid #00A6C0' : '4px solid #fff',
                                                                            background: isCorrect ? '#E8FDF5' : isWrong ? '#FFF0F0' : isSelected ? '#E0F7FA' : '#fff',
                                                                            fontSize: 18,
                                                                            fontWeight: 800,
                                                                            color: '#001F3F',
                                                                            cursor: quizSubmitted ? 'default' : 'pointer',
                                                                            textAlign: 'left',
                                                                            boxShadow: isSelected ? '0 10px 20px rgba(0, 166, 192, 0.1)' : '0 4px 10px rgba(0,0,0,0.02)',
                                                                            transition: 'all 0.2s'
                                                                        }}
                                                                    >
                                                                        <span style={{ width: 40, height: 40, background: isSelected ? '#00A6C0' : '#F1F1F1', color: isSelected ? '#fff' : '#001F3F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginRight: 16, fontSize: 14 }}>{opt.toUpperCase()}</span>
                                                                        {q[`option_${opt}`]}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                {!quizSubmitted ? (
                                                    <button onClick={() => {
                                                        const score = quizQuestions.filter(q => quizAnswers[q.id] === q.correct_answer).length
                                                        setQuizScore(score)
                                                        setQuizSubmitted(true)
                                                        if (score >= Math.ceil(quizQuestions.length * 0.6)) {
                                                            setQuizPassed(true)
                                                            const newCompleted = [...new Set([...completedLessons, lessonId])]
                                                            setCompletedLessons(newCompleted)
                                                            localStorage.setItem('completedLessons', JSON.stringify(newCompleted))
                                                            toast.success('CHALLENGE CONQUERED! 🏆', { duration: 3000 })
                                                        } else {
                                                            toast.error(`Scored ${score}/${quizQuestions.length}. Review and try again!`)
                                                        }
                                                    }} disabled={Object.keys(quizAnswers).length < quizQuestions.length} className="btn-primary" style={{ height: 80, fontSize: 24, background: '#1DD1A1', color: '#fff', borderRadius: 25, boxShadow: '0 20px 40px rgba(29, 209, 161, 0.3)' }}>
                                                        FINISH CHALLENGE 🚀
                                                    </button>
                                                ) : !quizPassed ? (
                                                    <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setQuizScore(0) }} className="btn-primary" style={{ height: 80, fontSize: 24, background: '#00A6C0', color: '#fff', borderRadius: 25 }}>
                                                        TRY AGAIN 🔄
                                                    </button>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Adaptive Footer Navigation */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginBottom: 80 }}>
                            {(quizPassed || quizQuestions.length === 0) && (
                                <>
                                    {!isLastLesson ? (
                                        nextLessonId && (
                                            <Link to={`/dashboard/lesson/${nextLessonId}`} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 400, height: 72, fontSize: 22, fontWeight: 900, borderRadius: '25px', background: '#1DD1A1', boxShadow: '0 15px 30px rgba(29, 209, 161, 0.3)', animation: 'pulse 2s infinite', color: '#fff', textDecoration: 'none' }}>
                                                <Rocket size={24} /> Next Lesson →
                                            </Link>
                                        )
                                    ) : (
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 800, color: '#001F3F' }}>
                                                🎓 You have completed all lessons!
                                            </div>
                                            <Link to={`/dashboard/course/${lesson.course_id}/final-exam`} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '24px 48px', fontSize: 22, borderRadius: 30, background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9F43 100%)', boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)', fontWeight: 900, color: '#fff', textDecoration: 'none' }}>
                                                <Sparkles size={28} /> TAKE FINAL EXAM (20 QUESTIONS) <Trophy size={28} />
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                            {(!quizPassed && quizQuestions.length > 0) && (
                                <p style={{ color: '#888', fontWeight: 800, fontSize: 16 }}>Finish the challenge to unlock the next level! 🗝️</p>
                            )}
                            <p style={{ color: '#888', fontWeight: 600, fontSize: 15, marginTop: 10 }}>You're doing great! Keep gathering seeds of kindness. 🌱</p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 1024px) {
                    .lesson-sidebar { display: none !important; }
                    .main-content-layout { margin-left: 0 !important; }
                    .mobile-progress-bar { display: block !important; }
                }
            `}</style>
        </div>
    )
}
