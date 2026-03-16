import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                // Map supabase session to your user object
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    role: session.user.user_metadata?.role || 'student'
                })
            }
            setLoading(false)
        }

        getSession()

        // Listen for changes on auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email,
                    role: session.user.user_metadata?.role || 'student'
                })
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (error) throw error

        const userObj = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email,
            role: data.user.user_metadata?.role || 'student'
        }
        setUser(userObj)
        return userObj
    }

    const register = async (name, email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: 'student' // Default role
                }
            }
        })

        if (error) throw error
        
        // Supabase often requires email verification by default. 
        // If data.session is null, it means verification is pending.
        const userObj = data.user ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || name,
            role: 'student'
        } : null

        if (data.session) setUser(userObj)
        return userObj
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
