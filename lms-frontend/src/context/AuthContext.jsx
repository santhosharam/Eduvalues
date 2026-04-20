import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // --- Guest Mode Activated ---
        // We set a default user so the app works without login
        setUser({
            _id: '660000000000000000000001',
            email: 'guest@eduvalues.com',
            name: 'Guest Adventurer',
            role: 'admin'
        })
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        const userObj = {
            id: data.user._id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role
        }
        localStorage.setItem('lms_token', data.token)
        setUser(userObj)
        return userObj
    }

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password })
        const userObj = {
            id: data.user._id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role
        }
        localStorage.setItem('lms_token', data.token)
        setUser(userObj)
        return userObj
    }

    const logout = async () => {
        localStorage.removeItem('lms_token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
