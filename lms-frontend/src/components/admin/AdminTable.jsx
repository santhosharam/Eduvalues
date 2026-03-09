import { ChevronRight, ChevronLeft, MoreVertical, Edit3, Trash2 } from 'lucide-react';

export default function AdminTable({
    headers,
    data,
    renderRow,
    loading,
    pagination,
    onPageChange,
    actions = true
}) {
    return (
        <div style={{ width: '100%', position: 'relative' }}>
            {/* Table Container with Premium Border and Shadow */}
            <div style={{
                background: 'rgba(10, 17, 32, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                backdropFilter: 'blur(32px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                {headers.map((h, i) => (
                                    <th key={i} style={{
                                        padding: '24px 32px',
                                        fontSize: 12,
                                        fontWeight: 800,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px'
                                    }}>
                                        {h}
                                    </th>
                                ))}
                                {actions && <th style={{ padding: '24px 32px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={headers.length + (actions ? 1 : 0)} style={{ padding: '80px', textAlign: 'center' }}>
                                        <div style={{
                                            display: 'inline-block',
                                            width: 32,
                                            height: 32,
                                            border: '3px solid rgba(0,166,192,0.1)',
                                            borderTopColor: '#00A6C0',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={headers.length + (actions ? 1 : 0)} style={{ padding: '80px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                                        No results found. Start by creating a record!
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, i) => (
                                    <tr
                                        key={i}
                                        style={{
                                            borderBottom: i === data.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                                            transition: 'background 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {renderRow(item)}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Optional Internal Pagination */}
                {pagination && (
                    <div style={{
                        padding: '20px 32px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                            Page <strong style={{ color: '#fff' }}>{pagination.currentPage}</strong> of <strong style={{ color: '#fff' }}>{pagination.totalPages}</strong>
                        </span>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => onPageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    opacity: pagination.currentPage === 1 ? 0.3 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => onPageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                style={{
                                    width: 44,
                                    height: 44,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    opacity: pagination.currentPage === pagination.totalPages ? 0.3 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
