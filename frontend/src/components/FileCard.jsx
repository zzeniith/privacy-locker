export default function FileCard({ file, onDownload, onDelete }) {
  const ext = file.filename.split('.').pop().toUpperCase()
  const size = (file.size / 1024).toFixed(1) + ' KB'
  const date = new Date(file.uploaded_at).toLocaleDateString()

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: '#6366f1', borderRadius: 8, padding: '6px 10px',
          fontSize: 11, fontWeight: 700, color: 'white' }}>{ext}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.filename}</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>{size} · {date}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-success" style={{ flex: 1, fontSize: 13 }} onClick={onDownload}>
          ⬇ Download
        </button>
        <button className="btn btn-danger" style={{ fontSize: 13 }} onClick={onDelete}>
          🗑
        </button>
      </div>
    </div>
  )
}