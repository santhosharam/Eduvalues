import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminStatsCard({
    header,
    value,
    trend,
    percentage,
    icon: Icon,
    color = '#00A6C0'
}) {
    return (
        <div style={{
            background: 'rgba(10, 17, 32, 0.4)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'default'
        }} onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.25)';
        }} onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}>

            {/* Background Accent Gradient */}
            <div style={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div>
                    <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: 12
                    }}>
                        {header}
                    </span>
                    <h3 style={{
                        fontSize: 42,
                        fontWeight: 900,
                        color: '#fff',
                        fontFamily: 'Outfit, sans-serif',
                        lineHeight: 1
                    }}>
                        {value}
                    </h3>
                </div>

                <div style={{
                    width: 56,
                    height: 56,
                    background: `${color}15`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${color}33`,
                    boxShadow: `0 8px 16px ${color}11`
                }}>
                    <Icon size={24} color={color} strokeWidth={2.5} />
                </div>
            </div>

            <div style={{
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: percentage > 0 ? 'rgba(29, 209, 161, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                    color: percentage > 0 ? '#1DD1A1' : '#FF6B6B'
                }}>
                    {percentage > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(percentage)}%
                </div>
                <span style={{ color: '#475569', fontSize: 13, fontWeight: 600 }}>vs. last month</span>
            </div>
        </div>
    );
}
