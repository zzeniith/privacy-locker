import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token, form.email)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#6366f1' }}>🔒 Privacy Locker</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 24 }}>Sign in to your vault</p>

        {error && <p style={{ color: '#f87171', marginBottom: 12, textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="input-field" type="email" placeholder="Email" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="input-field" type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button className="btn btn-primary" type="submit" style={{ marginTop: 4 }}>Sign In</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: 14 }}>
          No account? <Link to="/register" style={{ color: '#6366f1' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}