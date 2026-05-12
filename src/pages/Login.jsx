import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import api from '../api/axios'
import { useAuth } from "../context/AuthContext";

export default function Login() {
    
    const navigate = useNavigate()
    const { login } = useAuth()

    const [form, setForm] = useState({email: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        // Update only changed fields
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
            const res = await api.post('/api/auth/login', form)
            // Save token and user info to AuthContext + localStorage
            login(res.data.token, {
                name: res.data.name,
                email: res.data.email,
            })
            navigate('/')
        } catch(err){
            setError(err.response?.data?.error || 'Login failed')
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
        <div className="auth-card">
            <div className="auth-title">Welcome back</div>
            <div className="auth-subtitle">Sign in to your account</div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Password</label>
                <input
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                />
            </div>
            <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Signing in...' : 'Sign in'}
            </button>
            </form>

            <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
            </div>
        </div>
        </div>
    )    
}