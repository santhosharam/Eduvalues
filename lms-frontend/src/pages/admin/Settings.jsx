import { useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { Save, Globe, Shield, CreditCard, Mail, Palette, Layout, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        siteName: 'VE Value Education',
        siteTagline: 'Empowering future generations with core values.',
        supportEmail: 'support@eduvalues.in',
        enableRegistration: true,
        maintenanceMode: false,
        primaryColor: '#00A6C0',
        secondaryColor: '#001F3F'
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API write
        setTimeout(() => {
            toast.success('Core configurations deployed successfully.');
            setLoading(false);
        }, 800);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <AdminLayout
            title="System Parameters"
            subtitle="Configure global ecosystem preferences and platform behavioral settings."
        >
            <form onSubmit={handleSave} style={{ maxWidth: 900, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 40 }}>

                {/* Navigation Menu for Settings Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                        { icon: Globe, label: 'Platform Identity', active: true },
                        { icon: Shield, label: 'Security & Auth' },
                        { icon: CreditCard, label: 'Commerce Integrations' },
                        { icon: Mail, label: 'Email Automations' },
                        { icon: Palette, label: 'Aesthetic Tokens' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '16px 24px',
                            background: item.active ? 'rgba(0,166,192,0.1)' : 'transparent',
                            border: '1px solid ' + (item.active ? 'rgba(0,166,192,0.2)' : 'rgba(255,255,255,0.03)'),
                            borderRadius: '16px',
                            color: item.active ? '#00A6C0' : '#64748b',
                            fontSize: 14,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            <item.icon size={18} />
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* Configuration Panes Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Pane: Platform Identity */}
                    <div style={paneStyle}>
                        <h3 style={paneTitleStyle}>Platform Identity</h3>
                        <div style={{ display: 'grid', gap: 20 }}>
                            <div style={fieldGroupStyle}>
                                <label style={labelStyle}>Institution Label</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={fieldGroupStyle}>
                                <label style={labelStyle}>Vision/Tagline</label>
                                <input
                                    type="text"
                                    name="siteTagline"
                                    value={settings.siteTagline}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={fieldGroupStyle}>
                                <label style={labelStyle}>Official Contact Entry (Support Email)</label>
                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={settings.supportEmail}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pane: Behavioral Controls */}
                    <div style={paneStyle}>
                        <h3 style={paneTitleStyle}>Behavioral Controls</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={switchGroupStyle}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Enable Public Registration</div>
                                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginTop: 4 }}>Allow new students to join the ecosystem.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    name="enableRegistration"
                                    checked={settings.enableRegistration}
                                    onChange={handleChange}
                                    style={switchInputStyle}
                                />
                            </div>
                            <div style={switchGroupStyle}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ff6b6b' }}>Maintenance Protocol</div>
                                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginTop: 4 }}>Freeze all public-facing activity for core upgrades.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    style={switchInputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Persistent Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '16px 40px',
                                background: '#00A6C0',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: 900,
                                fontSize: 15,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                boxShadow: '0 10px 20px rgba(0,166,192,0.2)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 166, 192, 0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 166, 192, 0.2)'; }}
                        >
                            <Save size={18} /> {loading ? 'Committing Changes...' : 'Deploy Global Config'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

const paneStyle = {
    background: 'rgba(10, 17, 32, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '32px'
};
const paneTitleStyle = {
    fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px'
};
const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: 10 };
const labelStyle = { fontSize: 13, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 };
const inputStyle = {
    width: '100%', padding: '16px 20px', background: 'rgba(5, 10, 20, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
    color: '#fff', fontSize: '15px', fontWeight: 600, outline: 'none', fontFamily: 'Outfit, sans-serif'
};
const switchGroupStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' };
const switchInputStyle = { width: 44, height: 22, accentColor: '#00A6C0', cursor: 'pointer' };
