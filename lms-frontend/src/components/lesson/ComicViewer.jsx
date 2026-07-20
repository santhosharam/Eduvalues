import React from 'react'

export default function ComicViewer({ panels }) {
    if (!panels || !panels.length) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: '20px 0' }}>
            {panels.map((panel, idx) => (
                <div 
                    key={idx} 
                    className="comic-panel-card"
                    style={{
                        background: '#fff',
                        borderRadius: 30,
                        overflow: 'hidden',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
                        border: '2px solid #F1F1F1',
                        animation: `comicFadeIn 0.6s ease-out forwards`,
                        animationDelay: `${idx * 0.15}s`,
                        opacity: 0,
                        position: 'relative'
                    }}
                >
                    {/* Panel Number Badge */}
                    <div style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        background: '#00A6C0',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 900,
                        zIndex: 10,
                        boxShadow: '0 4px 10px rgba(0, 166, 192, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: 1
                    }}>
                        Panel {idx + 1}
                    </div>

                    {/* Image Area */}
                    <div style={{ padding: 12 }}>
                        <div style={{ 
                            borderRadius: 20, 
                            overflow: 'hidden', 
                            background: '#F8FAFB',
                            aspectRatio: '16/9',
                            position: 'relative'
                        }}>
                            <img 
                                src={panel.image} 
                                alt={`Story Panel ${idx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
                                }}
                            />
                        </div>
                    </div>

                    {/* Caption Speech Bubble */}
                    <div style={{ padding: '0 24px 24px' }}>
                        <div style={{
                            background: '#FFFDE7', // Soft yellow
                            border: '3px solid #FFF59D',
                            borderRadius: 16,
                            padding: '24px',
                            color: '#001F3F',
                            fontSize: 16,
                            fontWeight: 600,
                            lineHeight: 1.8,
                            position: 'relative',
                            fontFamily: '"Quicksand", sans-serif',
                            whiteSpace: 'pre-line'
                        }}>
                            {/* Little tip to make it look like a bubble */}
                            <div style={{
                                position: 'absolute',
                                top: -14,
                                left: 40,
                                width: 0,
                                height: 0,
                                borderLeft: '12px solid transparent',
                                borderRight: '12px solid transparent',
                                borderBottom: '12px solid #FFF59D',
                                zIndex: 1
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: -10,
                                left: 42,
                                width: 0,
                                height: 0,
                                borderLeft: '10px solid transparent',
                                borderRight: '10px solid transparent',
                                borderBottom: '10px solid #FFFDE7',
                                zIndex: 2
                            }} />
                            
                            {panel.caption}
                        </div>
                    </div>
                </div>
            ))}

            <style>{`
                @keyframes comicFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 600px) {
                    .comic-panel-card {
                        border-radius: 20px !important;
                    }
                }
            `}</style>
        </div>
    )
}
