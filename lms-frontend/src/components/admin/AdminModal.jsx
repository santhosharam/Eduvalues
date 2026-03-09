import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminModal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    width = 600,
    type = 'default' // default, info, success, warning
}) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getHeaderIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={28} color="#1DD1A1" />;
            case 'warning': return <AlertCircle size={28} color="#FFD93D" />;
            default: return null;
        }
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
                background: 'rgba(5, 10, 20, 0.85)',
                backdropFilter: 'blur(20px)',
                animation: 'fadeIn 0.25s ease'
            }}
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '32px',
                    width: '100%',
                    maxWidth: width,
                    maxHeight: 'calc(100vh - 80px)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                    animation: 'slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Header Decoration */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: type === 'success' ? '#1DD1A1' : '#00A6C0',
                    opacity: 0.8
                }} />

                {/* Header */}
                <div style={{
                    padding: '32px 32px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        {getHeaderIcon()}
                        <div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
                            {subtitle && <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>{subtitle}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 40,
                            height: 40,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    padding: '32px',
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#334155 transparent'
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '24px 32px 32px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(0,0,0,0.1)'
                    }}>
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
