const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
} else {
    console.error('❌ Supabase environment variables are missing!')
    
    // Create a safe, recursive throwing proxy to prevent startup crash
    const createThrowingProxy = (msg) => {
        const handler = {
            get: (target, prop) => {
                if (prop === 'then') return undefined
                const fn = () => { throw new Error(msg) }
                return new Proxy(fn, handler)
            }
        }
        return new Proxy({}, handler)
    }
    
    supabase = createThrowingProxy(
        `Supabase client is not initialized because environment variables are missing. (SUPABASE_URL exists: ${!!supabaseUrl}, SUPABASE_KEY exists: ${!!supabaseKey})`
    )
}

module.exports = supabase
