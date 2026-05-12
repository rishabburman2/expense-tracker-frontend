import { createContext, useContext, useState } from "react";

// AuthContext holds the logged in users token and info globally across the app
const AuthContext = createContext(null)

export function AuthProvider({children}) {
    
    // Initialize state from localStorage so user stays logged in even after refresh
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null))

    // Called after successful login or register
    // Saves token + username to both state and localStorage
    const login = (tokenValue, userValue) => {
        setToken(tokenValue)
        setUser(userValue)
        localStorage.setItem('token', tokenValue)
        localStorage.setItem('user', JSON.stringify(userValue))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}

// Custom hook - any component can call useAuth() to get current user, token, login, logout
export function useAuth(){
    return useContext(AuthContext)
}