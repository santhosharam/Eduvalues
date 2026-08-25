import React from 'react'

export default function ComicViewer({ panels }) {
    if (!panels || !panels.length) return null

    return (
        <div className="comic-viewer-container">
            {panels.map((panel, idx) => (
                <div 
                    key={idx} 
                    className="comic-panel-card"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                >
                    {/* Panel Number Badge */}
                    <div className="comic-panel-badge">
                        Panel {idx + 1}
                    </div>

                    {/* Image Area */}
                    <div className="comic-panel-image-container">
                        <div className="comic-panel-image-wrapper">
                            <img 
                                src={panel.image} 
                                alt={`Story Panel ${idx + 1}`}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
                                }}
                            />
                        </div>
                    </div>

                    {/* Caption Speech Bubble */}
                    <div className="comic-panel-caption-container">
                        <div className="comic-panel-caption">
                            {/* Little tip to make it look like a bubble */}
                            <div className="comic-panel-bubble-tip-border" />
                            <div className="comic-panel-bubble-tip-fill" />
                            
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

                .comic-viewer-container {
                    display: flex;
                    flex-direction: column;
                    gap: 48px;
                    padding: 20px 0;
                }

                .comic-panel-card {
                    background: #fff;
                    border-radius: 30px;
                    overflow: hidden;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
                    border: 2px solid #F1F1F1;
                    animation: comicFadeIn 0.6s ease-out forwards;
                    opacity: 0;
                    position: relative;
                }

                .comic-panel-badge {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: #00A6C0;
                    color: #fff;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 900;
                    z-index: 10;
                    box-shadow: 0 4px 10px rgba(0, 166, 192, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .comic-panel-image-container {
                    padding: 12px;
                }

                .comic-panel-image-wrapper {
                    border-radius: 20px;
                    overflow: hidden;
                    background: #F8FAFB;
                    aspect-ratio: 16/9;
                    position: relative;
                    width: 100%;
                }

                .comic-panel-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .comic-panel-caption-container {
                    padding: 0 24px 24px;
                }

                .comic-panel-caption {
                    background: #FFFDE7;
                    border: 3px solid #FFF59D;
                    border-radius: 16px;
                    padding: 24px;
                    color: #001F3F;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1.8;
                    position: relative;
                    font-family: "Quicksand", sans-serif;
                    white-space: pre-line;
                    word-wrap: break-word;
                }

                .comic-panel-bubble-tip-border {
                    position: absolute;
                    top: -14px;
                    left: 40px;
                    width: 0;
                    height: 0;
                    border-left: 12px solid transparent;
                    border-right: 12px solid transparent;
                    border-bottom: 12px solid #FFF59D;
                    z-index: 1;
                }

                .comic-panel-bubble-tip-fill {
                    position: absolute;
                    top: -10px;
                    left: 42px;
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #FFFDE7;
                    z-index: 2;
                }

                /* Mobile overrides */
                @media (max-width: 600px) {
                    .comic-viewer-container {
                        gap: 24px;
                        padding: 10px 0;
                    }
                    
                    .comic-panel-card {
                        width: calc(100% - 32px);
                        margin: 0 auto;
                        max-width: 480px;
                        border-radius: 20px;
                    }
                    
                    .comic-panel-badge {
                        top: 12px;
                        left: 12px;
                        padding: 6px 12px;
                        font-size: 11px;
                        border-radius: 8px;
                    }
                    
                    .comic-panel-image-container {
                        padding: 0;
                    }
                    
                    .comic-panel-image-wrapper {
                        border-radius: 20px 20px 0 0;
                        aspect-ratio: 1.5 / 1;
                    }
                    
                    .comic-panel-caption-container {
                        padding: 16px;
                    }
                    
                    .comic-panel-caption {
                        padding: 24px 24px;
                        font-size: 18px;
                        line-height: 1.5;
                        white-space: normal;
                    }
                    
                    .comic-panel-bubble-tip-border {
                        left: 50%;
                        transform: translateX(-50%);
                        margin-left: -12px;
                    }
                    
                    .comic-panel-bubble-tip-fill {
                        left: 50%;
                        transform: translateX(-50%);
                        margin-left: -10px;
                    }
                }
            `}</style>
        </div>
    )
}
