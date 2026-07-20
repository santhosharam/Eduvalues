import { useState, useEffect } from 'react';
import { Save, BookOpen, Rocket, Heart, Trophy, Palette, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';

export default function TabbedLessonForm({ initialData, onSubmit, onCancel, loading, isNew }) {
    const [activeTab, setActiveTab] = useState('reading');
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

    const tabs = [
        { id: 'reading', label: 'Reading Time', icon: BookOpen, color: '#00A6C0' },
        { id: 'summary', label: 'Quick Summary', icon: Rocket, color: '#FF9F43' },
        { id: 'moral', label: 'Moral Value', icon: Heart, color: '#FF6B6B' },
        { id: 'quiz', label: 'Brain Challenge (MCQs)', icon: Trophy, color: '#1DD1A1' },
        { id: 'assets', label: 'Assets & Settings', icon: Palette, color: '#94a3b8' }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 600 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 16px' }}>
                {tabs.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        style={{
                            padding: '16px 20px',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === t.id ? `3px solid ${t.color}` : '3px solid transparent',
                            color: activeTab === t.id ? t.color : '#64748b',
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <t.icon size={16} />
                        {t.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
                <form id="lesson-form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                    
                    <div style={{ display: activeTab === 'reading' ? 'block' : 'none' }}>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Lesson Title <span style={{ color: '#ff6b6b' }}>*</span></label>
                            <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Kindness" />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Order Index <span style={{ color: '#ff6b6b' }}>*</span></label>
                            <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} required style={inputStyle} />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>Reading Time <span style={{ color: '#ff6b6b' }}>*</span></label>
                            <input name="reading_time" value={formData.reading_time || ''} onChange={handleChange} required style={inputStyle} placeholder="e.g. 5 mins" />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>📖 The Story <span style={{ color: '#ff6b6b' }}>*</span></label>
                            <textarea name="story" value={formData.story} onChange={handleChange} required style={{...inputStyle, minHeight: '150px'}} placeholder="The main narrative..." />
                        </div>
                    </div>

                    <div style={{ display: activeTab === 'summary' ? 'block' : 'none' }}>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>🚀 Quick Summary</label>
                            <textarea name="quick_summary" value={formData.quick_summary || ''} onChange={handleChange} style={{...inputStyle, minHeight: '100px'}} placeholder="A short overview for the summary tab..." />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>🎯 What You'll Learn (Learning Goals)</label>
                            <textarea name="learning_goals" value={formData.learning_goals || ''} onChange={handleChange} style={{...inputStyle, minHeight: '100px'}} placeholder="Bullet points (one per line)..." />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>💡 Parent Tip</label>
                            <textarea name="parent_tip" value={formData.parent_tip || ''} onChange={handleChange} style={{...inputStyle, minHeight: '80px'}} placeholder="Guidance for parents..." />
                        </div>
                    </div>

                    <div style={{ display: activeTab === 'moral' ? 'block' : 'none' }}>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>💎 Moral Value <span style={{ color: '#ff6b6b' }}>*</span></label>
                            <input name="moral_value" value={formData.moral_value || ''} onChange={handleChange} required style={inputStyle} placeholder="The core lesson..." />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>✅ To-Do List</label>
                            <textarea name="todo_list" value={formData.todo_list || ''} onChange={handleChange} style={{...inputStyle, minHeight: '100px'}} placeholder="Action items (one per line)..." />
                        </div>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>💬 Text FAQ (Optional Text Q&A)</label>
                            {(() => {
                                const parseQA = (text) => {
                                    if (!text) return [{ q: '', a: '' }];
                                    const blocks = text.split('|||');
                                    return blocks.map(b => {
                                        const parts = b.split('===');
                                        return { q: parts[0] || '', a: parts[1] || '' };
                                    });
                                };
                                const qaList = parseQA(formData.qa_items);
                                
                                const updateQA = (idx, field, value) => {
                                    const newList = [...qaList];
                                    newList[idx][field] = value;
                                    setFormData(prev => ({
                                        ...prev,
                                        qa_items: newList.map(item => `${item.q}===${item.a}`).join('|||')
                                    }));
                                };

                                const addQA = () => {
                                    setFormData(prev => ({
                                        ...prev,
                                        qa_items: (prev.qa_items ? prev.qa_items + '|||===' : '===')
                                    }));
                                };

                                const removeQA = (idx) => {
                                    const newList = [...qaList];
                                    newList.splice(idx, 1);
                                    setFormData(prev => ({
                                        ...prev,
                                        qa_items: newList.length > 0 ? newList.map(item => `${item.q}===${item.a}`).join('|||') : ''
                                    }));
                                };

                                return (
                                    <div style={{ display: 'grid', gap: 16 }}>
                                        {qaList.map((qa, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <label style={{ fontSize: 12, color: '#00A6C0', fontWeight: 800 }}>Q&A Item #{i + 1}</label>
                                                    {qaList.length > 1 && <button type="button" onClick={() => removeQA(i)} style={{ background: 'none', border: 'none', color: '#FF6B6B', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Remove</button>}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    <input placeholder="Question..." value={qa.q} onChange={(e) => updateQA(i, 'q', e.target.value)} style={inputStyle} />
                                                    <textarea placeholder="Answer..." value={qa.a} onChange={(e) => updateQA(i, 'a', e.target.value)} style={{...inputStyle, minHeight: 60}} />
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addQA} style={{ padding: '10px', background: 'rgba(0, 166, 192, 0.1)', color: '#00A6C0', border: '1px dashed #00A6C0', borderRadius: 12, cursor: 'pointer', fontWeight: 700 }}>+ Add Another Q&A</button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div style={{ display: activeTab === 'assets' ? 'block' : 'none' }}>
                        <div style={fieldGroup}>
                            <label style={labelStyle}>🎥 Video Link (Optional)</label>
                            <input name="video_url" value={formData.video_url || ''} onChange={handleChange} style={inputStyle} placeholder="YouTube/Vimeo link" />
                        </div>
                        <div style={{...fieldGroup, flexDirection: 'row', alignItems: 'center'}}>
                            <input type="checkbox" name="isFree" checked={!!formData.isFree} onChange={handleChange} style={{ width: 18, height: 18, accentColor: '#00A6C0' }} />
                            <label style={{...labelStyle, marginBottom: 0}}>🔓 Free Preview?</label>
                        </div>
                    </div>
                </form>
                
                {activeTab === 'quiz' && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(29, 209, 161, 0.05)', borderRadius: 20, border: '2px dashed rgba(29, 209, 161, 0.2)', marginTop: 20 }}>
                        <Trophy size={48} color="#1DD1A1" style={{ marginBottom: 16 }} />
                        <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>Brain Challenge (MCQs)</h4>
                        {isNew ? (
                            <div style={{ color: '#FF9F43', fontSize: 15, fontWeight: 700, maxWidth: 400, margin: '0 auto', background: 'rgba(255, 159, 67, 0.1)', padding: '16px', borderRadius: '12px' }}>
                                ⚠️ You must click "Save Lesson" first before you can add multiple-choice quiz questions (A, B, C, D) to this lesson.
                            </div>
                        ) : (
                            <>
                                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>The quizzes are managed in their own dedicated builder with separate inputs for options and correct answers to keep things organized.</p>
                                <a href={`/admin/lessons/${initialData.id || initialData._id}/quiz`} style={{ display: 'inline-flex', padding: '12px 24px', background: '#1DD1A1', color: '#001F3F', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Open Quiz Builder</a>
                            </>
                        )}
                    </div>
                )}
                
                {activeTab === 'reading' && (
                    <div style={{ marginTop: 32, padding: '24px', background: 'rgba(0, 166, 192, 0.05)', borderRadius: 20, border: '2px dashed rgba(0, 166, 192, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ color: '#fff', fontSize: 16, marginBottom: 4 }}>Comic Panels</h4>
                                <p style={{ color: '#94a3b8', fontSize: 13, maxWidth: 400 }}>Upload and arrange the visual comic panels for this story.</p>
                            </div>
                            {isNew ? (
                                <div style={{ color: '#00A6C0', fontSize: 13, fontWeight: 700, padding: '8px 16px', background: 'rgba(0, 166, 192, 0.1)', borderRadius: '8px' }}>
                                    ⚠️ Save lesson first to manage panels
                                </div>
                            ) : (
                                <a href={`/admin/lessons/${initialData.id || initialData._id}/comics`} style={{ display: 'inline-flex', padding: '10px 20px', background: '#00A6C0', color: '#fff', borderRadius: 12, fontWeight: 800, textDecoration: 'none', whiteSpace: 'nowrap' }}>Manage Panels</a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" onClick={onCancel} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                <button type="submit" form="lesson-form" disabled={loading} style={{ padding: '12px 32px', background: '#00A6C0', color: '#fff', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {loading ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save Lesson
                </button>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const fieldGroup = { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 };
const labelStyle = { fontSize: 13, fontWeight: 700, color: '#f1f5f9' };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '14px 16px', background: 'rgba(5, 10, 20, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'Outfit', sans-serif" };
