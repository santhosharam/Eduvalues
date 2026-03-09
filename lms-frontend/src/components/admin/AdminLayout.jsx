import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', overflowX: 'hidden' }}>
            {/* Sidebar Component */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(5, 10, 20, 0.8)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 45
                    }}
                />
            )}

            {/* Main Application Area */}
            <div style={{
                flex: 1,
                marginLeft: 260,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                zIndex: 1
            }} className="admin-main">

                {/* Header Component */}
                <AdminHeader
                    title={title}
                    subtitle={subtitle}
                    onOpenSidebar={() => setSidebarOpen(true)}
                />

                {/* Page Content Rendering */}
                <main style={{
                    flex: 1,
                    padding: '40px 32px',
                    maxWidth: '1440px',
                    margin: '0 auto',
                    width: '100%'
                }}>
                    {children}
                </main>

                {/* Internal CSS for Responsiveness */}
                <style>{`
                    @media (max-width: 1024px) {
                        .admin-sidebar { transform: translateX(-100%) !important; }
                        .admin-sidebar.open { transform: translateX(0) !important; }
                        .admin-main { margin-left: 0 !important; }
                        .admin-hamburger { display: flex !important; }
                        .admin-search { display: none !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}
