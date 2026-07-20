import { useState, useEffect, useRef } from 'react'
import Navbar from '../../components/common/Navbar'
import { Brain, Sparkles, Trophy, RefreshCcw, Smile, Heart, Star, ArrowRight } from 'lucide-react'

// --- GAME 1: MEMORY MATCH VALUES ---
const MEMORY_CARDS = [
    { type: 'kind', emoji: '🤝', color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.15)' },
    { type: 'honesty', emoji: '😇', color: '#FF9F43', bg: 'rgba(255, 159, 67, 0.15)' },
    { type: 'courage', emoji: '🚀', color: '#00D2D3', bg: 'rgba(0, 210, 211, 0.15)' },
    { type: 'wisdom', emoji: '🧠', color: '#9B5DE5', bg: 'rgba(155, 93, 229, 0.15)' },
    { type: 'love', emoji: '💖', color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.15)' },
    { type: 'joy', emoji: '☀️', color: '#FFD200', bg: 'rgba(255, 210, 0, 0.15)' }
]

// --- GAME 2: BALLOON POPPER VALUES ---
const BALLOON_COLORS = ['#FF6B6B', '#FF9F43', '#00D2D3', '#1DD1A1', '#FFD200', '#9B5DE5']
const KIND_EMOJIS = [
    { emoji: '❤️', label: 'Love' },
    { emoji: '🎁', label: 'Gift' },
    { emoji: '🐱', label: 'Kitty' },
    { emoji: '😊', label: 'Smile' },
    { emoji: '🤝', label: 'Help' },
    { emoji: '🤗', label: 'Hug' },
    { emoji: '🌸', label: 'Flower' },
    { emoji: '🙌', label: 'Yay' }
]
const SAD_EMOJIS = [
    { emoji: '😢', label: 'Cry' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '💥', label: 'Hit' },
    { emoji: '😭', label: 'Scream' },
    { emoji: '😈', label: 'Naughty' }
]

export default function Playground() {
    const [activeTab, setActiveTab] = useState('balloon') // Default to highly visual balloon popper!
    const [mascotMessage, setMascotMessage] = useState("Pop the happy balloons to fill the rainbow! 🎈🌈")

    // ── GAME 1: MEMORY MATCH STATES ──────────────────────────────
    const [memCards, setMemCards] = useState([])
    const [memFlipped, setMemFlipped] = useState([])
    const [memMatched, setMemMatched] = useState([])
    const [memMoves, setMemMoves] = useState(0)
    const [memWon, setMemWon] = useState(false)

    // ── GAME 2: BALLOON POPPER STATES ───────────────────────────
    const [balloons, setBalloons] = useState([])
    const [happyMeter, setHappyMeter] = useState(0)
    const [popperWon, setPopperWon] = useState(false)
    const popperInterval = useRef(null)

    // ── SHUFFLE & INIT MEMORY GAME ───────────────────────────────
    const initMemoryGame = () => {
        const doubleCards = [...MEMORY_CARDS, ...MEMORY_CARDS].map((c, index) => ({
            ...c,
            id: index,
            isFlipped: false
        }))
        for (let i = doubleCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [doubleCards[i], doubleCards[j]] = [doubleCards[j], doubleCards[i]]
        }
        setMemCards(doubleCards)
        setMemFlipped([])
        setMemMatched([])
        setMemMoves(0)
        setMemWon(false)
    }

    const handleMemoryClick = (id) => {
        if (memFlipped.length === 2 || memFlipped.includes(id) || memMatched.includes(id)) return
        const newFlipped = [...memFlipped, id]
        setMemFlipped(newFlipped)

        if (newFlipped.length === 2) {
            setMemMoves(prev => prev + 1)
            const [firstId, secondId] = newFlipped
            const first = memCards.find(c => c.id === firstId)
            const second = memCards.find(c => c.id === secondId)

            if (first.type === second.type) {
                const newMatched = [...memMatched, firstId, secondId]
                setMemMatched(newMatched)
                setMemFlipped([])
                setMascotMessage("BINGO! You matched the visual values! 🌟")

                if (newMatched.length === memCards.length) {
                    setMemWon(true)
                    setMascotMessage("WOW! Your brain memory is brilliant! 🧠🏆")
                }
            } else {
                setTimeout(() => setMemFlipped([]), 900)
            }
        }
    }

    // ── BALLOON POPPER ENGINE ────────────────────────────────────
    const initBalloonGame = () => {
        setHappyMeter(0)
        setPopperWon(false)
        setMascotMessage("Tap the kind emojis! Skip the crying/angry faces! 😊🎈")
        
        // Spawn initial balloons at random heights
        const initial = Array.from({ length: 6 }).map((_, idx) => createBalloon(idx))
        setBalloons(initial)
    }

    const createBalloon = (index) => {
        const isKind = Math.random() > 0.35
        const emojiObj = isKind 
            ? KIND_EMOJIS[Math.floor(Math.random() * KIND_EMOJIS.length)]
            : SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)]
        
        return {
            id: index + Math.random(),
            x: 10 + Math.random() * 80, // percentage left
            y: 100 + Math.random() * 50, // initial vertical starting offset below grid
            color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
            emoji: emojiObj.emoji,
            label: emojiObj.label,
            isKind,
            speed: 0.35 + Math.random() * 0.45
        }
    }

    // Balloon Floating Loop
    useEffect(() => {
        if (activeTab === 'balloon') {
            initBalloonGame()
            popperInterval.current = setInterval(() => {
                setBalloons(prev => {
                    return prev.map(b => {
                        const nextY = b.y - b.speed
                        // If it drifts past the top, replace it
                        if (nextY < -15) {
                            return createBalloon(Math.random())
                        }
                        return { ...b, y: nextY }
                    })
                })
            }, 30)
        } else {
            initMemoryGame()
            if (popperInterval.current) clearInterval(popperInterval.current)
        }

        return () => {
            if (popperInterval.current) clearInterval(popperInterval.current)
        }
    }, [activeTab])

    const handlePopBalloon = (id, isKind) => {
        if (isKind) {
            // Success! Pop it and increase meter
            setHappyMeter(prev => {
                const next = Math.min(prev + 15, 100)
                if (next >= 100) {
                    setPopperWon(true)
                    setMascotMessage("FANTASTIC! You filled the Happy Meter! You matched all the kindness! 🌈☀️")
                }
                return next
            })
            // Spawn a replacement
            setBalloons(prev => prev.map(b => b.id === id ? createBalloon(Math.random()) : b))
            setMascotMessage("YAY! Pop goes the Kindness balloon! 🎈✨")
        } else {
            // Friendly bounce feedback
            setMascotMessage("Oops! Look for the kind/happy face! 🌸🤝")
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFB', paddingBottom: 100 }}>
            <Navbar />

            {/* Bouncy Header */}
            <div style={{ background: '#001F3F', color: '#fff', padding: '50px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, left: -30, width: 140, height: 140, background: 'rgba(0,166,192,0.15)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: -30, right: -30, width: 180, height: 180, background: 'rgba(29,209,161,0.15)', borderRadius: '50%' }} />
                
                <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', padding: '6px 20px', borderRadius: 45, border: '2px solid rgba(255,255,255,0.2)', marginBottom: 12 }}>
                        <Sparkles size={18} color="#00D2D3" />
                        <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'Fredoka', color: '#00D2D3' }}>VE VALUES PLAYGROUND</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, fontFamily: 'Fredoka', margin: 0, color: '#fff' }}>
                        Play & Grow Games! 🎨
                    </h1>
                </div>
            </div>

            <main className="section-container" style={{ maxWidth: 850, marginTop: 32, padding: '0 24px' }}>
                {/* ══ GAME MODE SELECTOR (Giant Visual Buttons) ═════════ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    <button
                        onClick={() => setActiveTab('balloon')}
                        style={{
                            background: activeTab === 'balloon' ? '#00D2D3' : '#fff',
                            border: activeTab === 'balloon' ? '4px solid #00A6C0' : '4px solid #F1F1F1',
                            boxShadow: activeTab === 'balloon' ? '0 10px 0 #00A6C0' : '0 8px 0 #F1F1F1',
                            padding: '24px 20px',
                            borderRadius: 28,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            position: 'relative',
                            top: activeTab === 'balloon' ? '4px' : '0'
                        }}
                    >
                        <span style={{ fontSize: 44 }} className="animate-float">🎈</span>
                        <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka', color: activeTab === 'balloon' ? '#fff' : '#001F3F' }}>
                            Kindness Balloon Popper
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('memory')}
                        style={{
                            background: activeTab === 'memory' ? '#FF9F43' : '#fff',
                            border: activeTab === 'memory' ? '4px solid #d35400' : '4px solid #F1F1F1',
                            boxShadow: activeTab === 'memory' ? '0 10px 0 #d35400' : '0 8px 0 #F1F1F1',
                            padding: '24px 20px',
                            borderRadius: 28,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            position: 'relative',
                            top: activeTab === 'memory' ? '4px' : '0'
                        }}
                    >
                        <span style={{ fontSize: 44 }} className="animate-float">🧩</span>
                        <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'Fredoka', color: activeTab === 'memory' ? '#fff' : '#001F3F' }}>
                            Moral Value Memory Match
                        </span>
                    </button>
                </div>

                {/* Bunny dialog block */}
                <div style={{
                    background: '#fff',
                    borderRadius: 24,
                    border: '3px solid #F1F1F1',
                    boxShadow: '0 8px 0 #F1F1F1',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 32
                }}>
                    <span style={{ fontSize: 32 }} className="animate-float">🐰</span>
                    <div>
                        <h4 style={{ margin: '0 0 2px', fontSize: 14, color: '#00A6C0', fontWeight: 900, fontFamily: 'Fredoka' }}>VE BUNNY HELPER:</h4>
                        <p style={{ margin: 0, fontSize: 18, color: '#001F3F', fontWeight: 900, fontFamily: 'Fredoka' }}>"{mascotMessage}"</p>
                    </div>
                </div>

                {/* ══ GAME 1: BALLOON POPPER PANEL ══════════════════════ */}
                {activeTab === 'balloon' && (
                    <div style={{ background: '#fff', borderRadius: 32, border: '3px solid #F1F1F1', boxShadow: '0 10px 0 #F1F1F1', padding: 32, position: 'relative' }}>
                        {popperWon ? (
                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                <span style={{ fontSize: 80 }} className="animate-float">🌈☀️🎉</span>
                                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#001F3F', fontFamily: 'Fredoka', margin: '20px 0 10px' }}>YOU ARE AMAZING!</h2>
                                <p style={{ fontSize: 18, color: '#666', fontWeight: 700, marginBottom: 28 }}>You filled the Kindness progress map!</p>
                                <button
                                    onClick={initBalloonGame}
                                    className="btn-primary"
                                    style={{ background: '#1DD1A1', height: 60, borderRadius: 20, boxShadow: '0 6px 0 #10ac84' }}
                                >
                                    Play Popper Again!
                                </button>
                            </div>
                        ) : (
                            <div>
                                {/* Visual target cloud */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                    <div style={{ background: '#E0F7FA', border: '3px solid #B2EBF2', padding: '12px 24px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ fontSize: 16, fontWeight: 900, color: '#00A6C0', fontFamily: 'Fredoka' }}>TAP GOOD VALUES:</span>
                                        <span style={{ fontSize: 24 }}>❤️ 🎁 😊 🤝</span>
                                    </div>
                                </div>

                                {/* Huge Happy Candy Meter */}
                                <div style={{ marginBottom: 30 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#001F3F', fontFamily: 'Fredoka', marginBottom: 10 }}>
                                        <span>Happy Kindness Meter!</span>
                                        <span>{happyMeter}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: 32, background: '#F1F1F1', borderRadius: 16, padding: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${happyMeter}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #1DD1A1, #00D2D3)',
                                            borderRadius: 12,
                                            transition: 'width 0.4s ease-out'
                                        }} />
                                    </div>
                                </div>

                                {/* Sky Play Arena */}
                                <div style={{
                                    height: 400,
                                    background: 'linear-gradient(180deg, #E0F7FA 0%, #FFF 100%)',
                                    borderRadius: 24,
                                    border: '3px solid #E4EBF0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                }}>
                                    {balloons.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => handlePopBalloon(b.id, b.isKind)}
                                            style={{
                                                position: 'absolute',
                                                left: `${b.x}%`,
                                                top: `${b.y}%`,
                                                width: 100,
                                                height: 125,
                                                background: b.color,
                                                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                                                border: '4px solid #fff',
                                                boxShadow: 'inset -10px -10px 0 rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.12)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'transform 0.1s ease',
                                                transform: 'translate(-50%, -50%)',
                                                padding: 0
                                            }}
                                            onMouseDown={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.9)'}
                                        >
                                            <span style={{ fontSize: 44 }}>{b.emoji}</span>
                                            {/* Balloon string tail */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: -15,
                                                left: '50%',
                                                width: 3,
                                                height: 15,
                                                background: '#636e72',
                                                transform: 'translateX(-50%)'
                                            }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ══ GAME 2: MEMORY MATCH PANEL ═══════════════════════ */}
                {activeTab === 'memory' && (
                    <div style={{ background: '#fff', borderRadius: 32, border: '3px solid #F1F1F1', boxShadow: '0 10px 0 #F1F1F1', padding: 32 }}>
                        {memWon ? (
                            <div style={{ padding: '40px 0', textAlign: 'center' }}>
                                <Trophy size={80} color="#FFD700" className="animate-float" style={{ marginBottom: 20 }} />
                                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#001F3F', fontFamily: 'Fredoka', margin: '20px 0 10px' }}>CONGRATULATIONS!</h2>
                                <p style={{ fontSize: 18, color: '#666', fontWeight: 700, marginBottom: 28 }}>
                                    You completed the quest in <strong style={{ color: '#FF9F43', fontSize: 24 }}>{memMoves}</strong> turns!
                                </p>
                                <button
                                    onClick={initMemoryGame}
                                    className="btn-primary"
                                    style={{ background: '#FF9F43', height: 60, borderRadius: 20, boxShadow: '0 6px 0 #d35400' }}
                                >
                                    Play Memory Again!
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: '#001F3F', fontFamily: 'Fredoka' }}>
                                        Moves: <span style={{ color: '#FF9F43', fontSize: 24 }}>{memMoves}</span>
                                    </div>
                                    <button
                                        onClick={initMemoryGame}
                                        className="btn-primary"
                                        style={{
                                            background: '#FF9F43',
                                            height: 44,
                                            padding: '0 20px',
                                            fontSize: 14,
                                            borderRadius: 14,
                                            boxShadow: '0 4px 0 #d35400',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            color: '#fff',
                                            fontWeight: 900,
                                            fontFamily: 'Fredoka'
                                        }}
                                    >
                                        <RefreshCcw size={16} /> Restart
                                    </button>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                    gap: 16
                                }}>
                                    {memCards.map(card => {
                                        const isFlipped = memFlipped.includes(card.id) || memMatched.includes(card.id)
                                        return (
                                            <button
                                                key={card.id}
                                                onClick={() => handleMemoryClick(card.id)}
                                                style={{
                                                    aspectRatio: '1',
                                                    background: isFlipped ? '#fff' : '#FF9F43',
                                                    border: isFlipped ? `4px solid ${card.color}` : '4px solid #fff',
                                                    borderRadius: 24,
                                                    boxShadow: isFlipped ? `0 8px 0 ${card.color}` : '0 8px 0 #d35400',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    position: 'relative',
                                                    top: 0
                                                }}
                                                onMouseDown={e => { e.currentTarget.style.top = '4px' }}
                                                onMouseUp={e => { e.currentTarget.style.top = '0px' }}
                                            >
                                                {isFlipped ? (
                                                    <span style={{ fontSize: 52 }}>{card.emoji}</span>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                        <Sparkles size={32} color="#fff" />
                                                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 900, fontFamily: 'Fredoka' }}>VE QUEST</span>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
