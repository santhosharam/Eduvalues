import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // Map Supabase user to your app's user object
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || 'User',
                    role: session.user.user_metadata?.role || 'student'
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        }

        getSession()

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || 'User',
                    role: session.user.user_metadata?.role || 'student'
                })
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data.user
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
        return data.user
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
