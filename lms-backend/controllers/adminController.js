const supabase = require('../supabaseClient')

// GET /api/admin/stats
exports.getStats = async (req, res) => {
    try {
        const [
            { count: courseCount },
            { data: successPayments },
            { data: { users: authUsers } }
        ] = await Promise.all([
            supabase.from('courses').select('*', { count: 'exact', head: true }),
            supabase.from('payments').select('amount').eq('status', 'success'),
            supabase.auth.admin.listUsers()
        ])

        const revenue = successPayments?.reduce((s, p) => s + (p.amount || 0), 0) || 0
        const studentCount = authUsers?.filter(u => u.user_metadata?.role !== 'admin').length || 0

        res.json({ 
            courses: courseCount || 0, 
            students: studentCount, 
            payments: successPayments?.length || 0, 
            revenue 
        })
    } catch (err) {
        console.error('[ADMIN_STATS_ERROR]', err.message)
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/students
exports.getStudents = async (req, res) => {
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers()
        if (error) throw error

        const students = users
            .filter(u => u.user_metadata?.role !== 'admin')
            .map(u => ({
                id: u.id,
                name: u.user_metadata?.full_name || 'N/A',
                email: u.email,
                lastSignIn: u.last_sign_in_at,
                createdAt: u.created_at
            }))

        res.json({ students })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/admin/students/:id
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params
        
        // 1. Delete from Auth
        const { error: authErr } = await supabase.auth.admin.deleteUser(id)
        if (authErr) throw authErr

        // 2. Cleanup Enrollments (Cascade delete should handle this if configured, but let's be safe)
        await supabase.from('enrollments').delete().eq('student_id', id)
        await supabase.from('payments').delete().eq('student_id', id)

        res.json({ message: 'Student and all related data deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/admin/certificates
exports.getCertificates = async (req, res) => {
    try {
        const { data: certs, error } = await supabase
            .from('certificates')
            .select('*, courses(title)')
            .order('issued_at', { ascending: false })
        
        if (error) throw error

        // Enrich with user data from Auth
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const userMap = Object.fromEntries(users.map(u => [u.id, { 
            name: u.user_metadata?.full_name || 'N/A', 
            email: u.email 
        }]))

        const enrichedCerts = certs.map(c => ({
            ...c,
            user: userMap[c.student_id] || { name: 'Unknown Student' },
            code: c.unique_code,
            createdAt: c.issued_at
        }))

        res.json({ certificates: enrichedCerts })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
