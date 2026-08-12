import { useState, useRef } from 'react';
import { Save, X, Loader2, UploadCloud, ImageIcon, CheckCircle, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminForm({
    onSubmit,
    initialData = {},
    fields,
    loading,
    onCancel
}) {
    const [formData, setFormData] = useState(initialData);
    const [uploadingField, setUploadingField] = useState(null);
    const fileInputRefs = useRef({});

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so selecting the same file again triggers onChange
        if (fileInputRefs.current[fieldName]) {
            fileInputRefs.current[fieldName].value = '';
        }

        // Validate size (5MB) and type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return toast.error('Only JPG, PNG, and WebP images are allowed.');
        }
        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Image must be smaller than 5 MB.');
        }

        setUploadingField(fieldName);
        const data = new FormData();
        data.append('image', file);
        
        // Pass IDs if they exist for folder routing
        if (formData.courseId || formData.course_id) data.append('courseId', formData.courseId || formData.course_id);
        if (formData.lessonId || formData.lesson_id) data.append('lessonId', formData.lessonId || formData.lesson_id);

        try {
            const res = await api.post('/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
            toast.success('Image uploaded and verified.');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.message || err.message || 'Image upload failed. Please try again.');
        } finally {
            setUploadingField(null);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;
        
        // Convert to number if it's a numeric field
        const field = fields.find(f => f.name === name);
        if (field?.type === 'number') {
            finalValue = value === '' ? 0 : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {fields.map((field, idx) => {
                    if (field.type === 'header') {
                        return (
                            <div key={idx} style={{ marginTop: '24px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {field.label}
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '8px' }}></div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                {field.type === 'checkbox' && (
                                    <input
                                        name={field.name}
                                        type="checkbox"
                                        checked={!!formData[field.name]}
                                        onChange={handleChange}
                                        style={checkboxStyle}
                                    />
                                )}
                                {field.label} {field.required && <span style={{ color: '#ff6b6b' }}>*</span>}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] ?? ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required && !formData[field.name]}
                                    style={inputBaseStyle}
                                    rows={field.rows || 4}
                                />
                            ) : field.type === 'image' ? (
                                <div style={{ 
                                    border: '2px dashed rgba(255,255,255,0.1)', 
                                    borderRadius: '16px', 
                                    padding: '24px', 
                                    textAlign: 'center',
                                    background: 'rgba(5, 10, 20, 0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 16,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <input 
                                        type="file" 
                                        accept="image/jpeg, image/png, image/webp" 
                                        style={{ display: 'none' }}
                                        ref={el => fileInputRefs.current[field.name] = el}
                                        onChange={(e) => handleImageUpload(e, field.name)}
                                    />
                                    
                                    {formData[field.name] ? (
                                        <div style={{ position: 'relative', width: '100%', maxWidth: 300, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={formData[field.name]} alt="Preview" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                                            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8 }}>
                                                <button type="button" onClick={() => fileInputRefs.current[field.name]?.click()} style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Edit size={14} /> Replace
                                                </button>
                                                <button type="button" onClick={() => setFormData(prev => ({...prev, [field.name]: ''}))} style={{ background: 'rgba(255,0,0,0.7)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(29, 209, 161, 0.9)', color: '#000', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircle size={14} /> Uploaded
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0, 166, 192, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A6C0' }}>
                                                {uploadingField === field.name ? <Loader2 size={32} className="spin" /> : <UploadCloud size={32} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>
                                                    {uploadingField === field.name ? 'Uploading to secure storage...' : 'Click to select an image'}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Supports JPG, PNG, WebP (Max 5MB)</div>
                                            </div>
                                            <button
                                                type="button"
                                                disabled={uploadingField === field.name}
                                                onClick={() => fileInputRefs.current[field.name]?.click()}
                                                style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 800, fontSize: 13, cursor: uploadingField === field.name ? 'not-allowed' : 'pointer' }}
                                            >
                                                Browse Files
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name] ?? ''}
                                    onChange={handleChange}
                                    required={field.required}
                                    style={inputBaseStyle}
                                >
                                    <option value="" disabled>{field.placeholder || '-- Select Option --'}</option>
                                    {field.options.map((opt, i) => (
                                        <option key={i} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type !== 'checkbox' ? (
                                <input
                                    name={field.name}
                                    type={field.type || 'text'}
                                    value={formData[field.name] ?? ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    style={inputBaseStyle}
                                />
                            ) : null}
                        </div>
                    );
                })}
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

const checkboxStyle = {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    accentColor: '#00A6C0'
};

const inputBaseStyle = {
    width: '100%',
    boxSizing: 'border-box',
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
