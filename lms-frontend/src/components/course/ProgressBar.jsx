export default function ProgressBar({ percent = 0, label = true, height = 6 }) {
    return (
        <div>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>{percent}%</span>
                </div>
            )}
            <div className="progress-bar" style={{ height }}>
                <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}
