import { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('lms_token')
        if (token) {
            api.get('/auth/me')
                .then(res => setUser(res.data.user))
                .catch(() => localStorage.removeItem('lms_token'))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        localStorage.setItem('lms_token', data.token)
        setUser(data.user)
        return data.user
    }

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password })
        localStorage.setItem('lms_token', data.token)
        setUser(data.user)
        return data.user
    }

    const logout = () => {
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
