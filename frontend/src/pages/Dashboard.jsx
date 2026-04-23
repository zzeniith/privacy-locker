import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])

  useEffect(() => {
    if (!user) navigate('/login')
    else fetchFiles()
  }, [user])

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files/list')
      setFiles(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      fetchFiles()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob'
      })
      
      const ext = fileName.split('.').pop().toLowerCase()
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'pdf': 'application/pdf',
        'txt': 'text/plain'
      }
      
      const blob = new Blob([response.data], { 
        type: mimeTypes[ext] || 'application/octet-stream' 
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName || fileId)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed')
    }
  }

  const handleView = async (fileId) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob'
      })
      
      const ext = fileId.split('.').pop().toLowerCase()
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif'
      }
      
      const blob = new Blob([response.data], { 
        type: mimeTypes[ext] || 'application/octet-stream' 
      })
      
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      console.error('View failed:', err)
      alert('View failed')
    }
  }

  const isImage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1>🔒 Your Vault</h1>
        <div>
          <span style={{ color: '#94a3b8', marginRight: 16 }}>{user.email}</span>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <input 
          type="file" 
          onChange={handleUpload}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label 
          htmlFor="file-input"
          style={{ padding: '12px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', cursor: 'pointer', display: 'inline-block' }}
        >
          📁 Upload File
        </label>
      </div>

      <div>
        <h3 style={{ marginBottom: 16, color: '#94a3b8' }}>Your Files</h3>
        {files.length === 0 ? (
          <p style={{ color: '#64748b' }}>No files yet. Upload your first file!</p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {files.map(file => (
              <div key={file.file_id} style={{ padding: 16, background: '#1e293b', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{file.name}</p>
                  <p style={{ color: '#94a3b8', fontSize: 12 }}>{(file.size / 1024).toFixed(1)} KB • {new Date(file.uploaded_at).toLocaleDateString()}</p>
                </div>
                <div>
                  {isImage(file.name) && (
                    <button 
                      onClick={() => handleView(file.file_id)}
                      style={{ padding: '8px 16px', borderRadius: 8, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 8 }}
                    >
                      View
                    </button>
                  )}
                  <button 
                    onClick={() => handleDownload(file.file_id, file.name)}
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}