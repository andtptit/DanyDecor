'use client'

import { useState, useTransition } from 'react'
import { HardDrive, Search, Trash2, RefreshCw, ImageIcon, AlertTriangle } from 'lucide-react'
import { scanStorageAction, deleteFilesAction } from './actions'

interface OrphanedFile {
  bucket: string
  name: string
  fullPath: string
  size: number
  url: string
}

interface Props {
  initialUsage: { totalBytes: number; fileCount: number }
}

// Dung lượng miễn phí tham chiếu của Supabase Storage (1GB)
const FREE_LIMIT = 1024 * 1024 * 1024

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export default function StorageManager({ initialUsage }: Props) {
  const [usage, setUsage] = useState(initialUsage)
  const [files, setFiles] = useState<OrphanedFile[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState<string>('')
  const [isScanning, startScan] = useTransition()
  const [isDeleting, startDelete] = useTransition()

  const percent = Math.min(100, Math.round((usage.totalBytes / FREE_LIMIT) * 100))
  const barColor = percent >= 90 ? 'bg-red-500' : percent >= 70 ? 'bg-amber-500' : 'bg-primary'

  const orphanBytes = (files || [])
    .filter(f => selected.has(f.name))
    .reduce((sum, f) => sum + f.size, 0)

  function handleScan() {
    setMessage('')
    startScan(async () => {
      const res = await scanStorageAction()
      if (res.success) {
        const found = (res.files || []) as OrphanedFile[]
        setFiles(found)
        setSelected(new Set())
        if (found.length === 0) setMessage('Không tìm thấy ảnh mồ côi nào. Kho ảnh sạch sẽ 👍')
      } else {
        setMessage(res.error || 'Có lỗi khi quét kho ảnh')
      }
    })
  }

  function toggle(name: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  function toggleAll() {
    if (!files) return
    if (selected.size === files.length) setSelected(new Set())
    else setSelected(new Set(files.map(f => f.name)))
  }

  function handleDelete() {
    if (!files || selected.size === 0) return
    const toDelete = files.filter(f => selected.has(f.name)).map(f => ({ bucket: f.bucket, name: f.name }))
    const freed = orphanBytes
    startDelete(async () => {
      const res = await deleteFilesAction(toDelete)
      if (res.success) {
        setFiles(prev => (prev ? prev.filter(f => !selected.has(f.name)) : prev))
        setUsage(u => ({ totalBytes: Math.max(0, u.totalBytes - freed), fileCount: Math.max(0, u.fileCount - (res.deletedCount || 0)) }))
        setSelected(new Set())
        setMessage(`Đã xoá ${res.deletedCount} ảnh, giải phóng ~${formatBytes(freed)}.`)
      } else {
        setMessage(res.error || 'Có lỗi khi xoá ảnh')
      }
    })
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
      <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-3">
        <HardDrive className="w-5 h-5 text-primary" /> Kho ảnh & Dung lượng
      </h2>

      {/* Thanh dung lượng */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-2xl font-bold text-dark">{formatBytes(usage.totalBytes)}</p>
            <p className="text-xs text-gray-400">{usage.fileCount} ảnh · trên tổng 1 GB miễn phí</p>
          </div>
          <span className={`text-sm font-bold ${percent >= 90 ? 'text-red-500' : percent >= 70 ? 'text-amber-500' : 'text-primary'}`}>
            {percent}%
          </span>
        </div>
        <div className="w-full h-3 bg-soft-gray rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${percent}%` }} />
        </div>
        {percent >= 80 && (
          <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Dung lượng sắp đầy — nên dọn ảnh không dùng hoặc nâng cấp gói.
          </p>
        )}
      </div>

      {/* Quét ảnh mồ côi */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="font-bold text-dark text-sm">Ảnh không còn được dùng</p>
            <p className="text-xs text-gray-400">Quét các ảnh trong kho không gắn với sản phẩm, danh mục hay banner nào.</p>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60 shrink-0"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isScanning ? 'Đang quét...' : 'Quét ảnh chưa dùng'}
          </button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-gray-600 bg-soft-gray/50 rounded-xl px-4 py-2.5">{message}</p>
        )}

        {files && files.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer">
                <input type="checkbox" checked={selected.size === files.length} onChange={toggleAll} className="accent-primary w-4 h-4" />
                Chọn tất cả ({files.length} ảnh · {formatBytes(files.reduce((s, f) => s + f.size, 0))})
              </label>
              <button
                onClick={handleDelete}
                disabled={selected.size === 0 || isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Xoá đã chọn{selected.size > 0 ? ` (${selected.size})` : ''}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {files.map(f => {
                const isSel = selected.has(f.name)
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => toggle(f.name)}
                    className={`relative group text-left rounded-2xl overflow-hidden border-2 transition-all ${isSel ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="aspect-square bg-soft-gray">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute top-2 left-2 w-5 h-5 rounded-md flex items-center justify-center bg-white/90 border border-gray-200">
                      {isSel && <div className="w-3 h-3 rounded-sm bg-red-500" />}
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-gray-400 truncate">{f.name}</p>
                      <p className="text-[10px] font-bold text-gray-500">{formatBytes(f.size)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {files && files.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Không có ảnh mồ côi.</p>
          </div>
        )}
      </div>
    </div>
  )
}
