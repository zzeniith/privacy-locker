import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', form)
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#6366f1' }}>🔒 Create Account</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 24 }}>Set up your private vault</p>

        {error && <p style={{ color: '#f87171', marginBottom: 12, textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: '#4ade80', marginBottom: 12, textAlign: 'center' }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="input-field" type="text" placeholder="Username" required
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          <input className="input-field" type="email" placeholder="Email" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="input-field" type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button className="btn btn-primary" type="submit">Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#94a3b8', fontSize: 14 }}>
          Have an account? <Link to="/login" style={{ color: '#6366f1' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}