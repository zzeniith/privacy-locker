import { useState, useEffect, useRef } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import FileCard from '../components/FileCard'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const { user, logout } = useAuth()
  const fileRef = useRef()
  const navigate = useNavigate()

  const fetchFiles = async () => {
    const res = await api.get('/files/list')
    setFiles(res.data)
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      await api.post('/files/upload', form)
      setMessage('File uploaded and encrypted!')
      fetchFiles()
    } catch {
      setMessage('Upload failed.')
    } finally {
      setUploading(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDownload = async (id, name) => {
    const res = await api.get(`/files/download/${id}`, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this file permanently?')) return
    await api.delete(`/files/${id}`)
    fetchFiles()
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#6366f1', fontSize: 24 }}>🔒 Privacy Locker</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Welcome, {user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : '+ Upload File'}
          </button>
          <button className="btn" style={{ background: '#1e1e2e', color: '#94a3b8' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleUpload} />

      {message && (
        <div style={{ padding: '12px 16px', background: '#1e2e1e', border: '1px solid #22c55e',
          borderRadius: 8, marginBottom: 20, color: '#4ade80' }}>
          {message}
        </div>
      )}

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📂</p>
          <p>Your vault is empty. Upload your first file.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {files.map(f => (
            <FileCard key={f.id} file={f}
              onDownload={() => handleDownload(f.id, f.filename)}
              onDelete={() => handleDelete(f.id)} />
          ))}
        </div>
      )}
    </div>
  )
}