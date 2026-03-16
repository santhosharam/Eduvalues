import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // --- Guest Mode Activated ---
        // We set a default user so the app works without login
        setUser({
            id: 'guest-123',
            email: 'guest@eduvalues.com',
            name: 'Guest Adventurer',
            role: 'admin' // Give admin access so they can see everything
        })
        setLoading(false)
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
