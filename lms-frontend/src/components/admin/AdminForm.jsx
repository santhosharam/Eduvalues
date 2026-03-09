import { useState } from 'react';
import { Save, X, Loader2 } from 'lucide-react';

export default function AdminForm({
    onSubmit,
    initialData = {},
    fields,
    loading,
    onCancel
}) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {fields.map((field, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.5px' }}>
                            {field.label} {field.required && <span style={{ color: '#ff6b6b' }}>*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required={field.required}
                                style={inputBaseStyle}
                                rows={field.rows || 4}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                style={inputBaseStyle}
                            >
                                <option value="" disabled>{field.placeholder || '-- Select Option --'}</option>
                                {field.options.map((opt, i) => (
                                    <option key={i} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                name={field.name}
                                type={field.type || 'text'}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required={field.required}
                                style={inputBaseStyle}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '24px'
            }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '14px 28px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        color: '#94a3b8',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                >
                    Discard Changes
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '14px 32px',
                        background: '#00A6C0',
                        border: 'none',
                        borderRadius: '16px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        boxShadow: '0 10px 20px rgba(0, 166, 192, 0.2)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 166, 192, 0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 166, 192, 0.2)'; }}
                >
                    {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                    {loading ? 'Processing...' : 'Save Data'}
                </button>
            </div>

            <style>{`
                .spin { animation: rotate 1s linear infinite; }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </form>
    );
}

const inputBaseStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(5, 10, 20, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: "'Outfit', sans-serif"
};
