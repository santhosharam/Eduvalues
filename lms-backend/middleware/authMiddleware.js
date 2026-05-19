const supabase = require('../supabaseClient')

exports.protect = async (req, res, next) => {
    if (req.method === 'OPTIONS') return next();

    const authHeader = req.headers.authorization || req.headers.Authorization;
    const xToken = req.headers['x-auth-token'];
    const qToken = req.query.token; // Emergency fallback
    
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (authHeader) {
        token = authHeader;
    } else if (xToken) {
        token = xToken;
    } else if (qToken) {
        token = qToken;
    }
    
    console.log(`>>> [PID:${process.pid}] AUTH ATTEMPT [${new Date().toISOString()}]:`, req.method, req.originalUrl)
    console.log('>>> Query Params:', JSON.stringify(req.query, null, 2))
    
    if (!token) {
        console.warn('>>> TOKEN MISSING! All Headers:', JSON.stringify(req.headers, null, 2))
        return res.status(401).json({ message: 'Authentication required (Token Missing)' })
    }

    try {
        console.log('--- AUTH DEBUG ---')
        console.log('Token received:', token.substring(0, 20) + '...')
        
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (error || !user) {
            const msg = error?.message || 'No user session found';
            console.error('Supabase Auth Error:', msg)
            return res.status(401).json({ message: `Auth Failed: ${msg}` })
        }
        
        console.log('User authenticated:', user.email)

        // Map Supabase user to req.user for consistency
        req.user = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: user.user_metadata?.role || 'student'
        }
        
        next()
    } catch (err) {
        console.error('Auth Middleware Error:', err.message)
        res.status(401).json({ message: 'Authentication failed' })
    }
}

exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
    next()
}
