import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const mapSupabaseUser = (sbUser) => {
        if (!sbUser) return null
        return {
            id: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.full_name || 'User',
            role: sbUser.user_metadata?.role || 'student'
        }
    }

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.access_token) {
                    console.log('✅ Session detected:', session.user.email)
                    localStorage.setItem('lms_token', session.access_token)
                } else {
                    console.warn('⚠️ No active session found during init')
                }
                setUser(mapSupabaseUser(session?.user))
            } catch (err) {
                console.error('Auth Init Error:', err)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('🔄 Auth State Change:', _event, session?.user?.email)
            if (session?.access_token) {
                localStorage.setItem('lms_token', session.access_token)
            } else {
                localStorage.removeItem('lms_token')
            }
            setUser(mapSupabaseUser(session?.user))
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        // Manual backup of the token
        if (data.session?.access_token) {
            localStorage.setItem('lms_token', data.session.access_token)
        }

        const mapped = mapSupabaseUser(data.user)
        setUser(mapped)
        return mapped
    }

    const register = async ({ name, email, password }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: 'student'
                }
            }
        })
        if (error) throw error
        const mapped = mapSupabaseUser(data.user)
        setUser(mapped)
        return mapped
    }

    const loginWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        if (error) throw error
        return data
    }

    const logout = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('lms_token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
