import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token, form.email)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ width: 400, padding: 32, background: '#1e293b', borderRadius: 16 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#6366f1' }}>🔒 Privacy Locker</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 24 }}>Sign in to your vault</p>

        {error && <p style={{ color: '#f87171', marginBottom: 12, textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input 
            style={{ padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            type="email" 
            placeholder="Email" 
            required
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          <input 
            style={{ padding: 12, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            type="password" 
            placeholder="Password" 
            required
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          <button 
            style={{ padding: 12, borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer' }}
            type="submit"
          >
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: 14 }}>
          New here? <Link to="/register" style={{ color: '#6366f1' }}>Create Account</Link>
        </p>
      </div>
    </div>
  )
}