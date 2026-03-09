import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'

// ── Public pages ────────────────────────────────────────────────
import Home from './pages/public/Home'
import Blog from './pages/public/Blog'
import Courses from './pages/public/Courses'
import CourseDetail from './pages/public/CourseDetail'
import Contact from './pages/public/Contact'
import Privacy from './pages/public/Privacy'
import Terms from './pages/public/Terms'
import CertificateVerify from './pages/public/CertificateVerify'

// ── Auth pages ───────────────────────────────────────────────────
import Login from './pages/auth/Login'
import AdminLogin from './pages/auth/AdminLogin'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// ── Student Dashboard (protected) ───────────────────────────────
import StudentDashboard from './pages/dashboard/StudentDashboard'
import MyCourses from './pages/dashboard/MyCourses'
import LessonPage from './pages/dashboard/LessonPage'
import Certificates from './pages/dashboard/Certificates'

// ── Payment pages (protected) ───────────────────────────────────
import Checkout from './pages/payment/Checkout'
import PaymentConfirmation from './pages/payment/PaymentConfirmation'

// ── Admin pages (protected + admin role) ────────────────────────
import AdminDashboard from './pages/admin/Dashboard'
import ManageCourses from './pages/admin/ManageCourses'
import ManageLessons from './pages/admin/ManageLessons'
import ManageStudents from './pages/admin/ManageStudents'
import ManagePayments from './pages/admin/ManagePayments'
import AdminCertificates from './pages/admin/Certificates'
import AdminSettings from './pages/admin/Settings'

// ── 404 ─────────────────────────────────────────────────────────
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              fontSize: 14,
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0f172a' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
          }}
        />
        <Routes>
          {/* ── Public ─────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify/:code" element={<CertificateVerify />} />

          {/* ── Auth ───────────────────────────────── */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Protected (student) ────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/dashboard/my-courses" element={<MyCourses />} />
            <Route path="/dashboard/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/dashboard/certificates" element={<Certificates />} />
            <Route path="/checkout/:courseId" element={<Checkout />} />
            <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
          </Route>

          {/* ── Protected (admin) ──────────────────── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/lessons" element={<ManageLessons />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/payments" element={<ManagePayments />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* ── 404 ────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
