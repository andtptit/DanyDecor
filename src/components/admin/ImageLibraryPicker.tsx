'use client'

import { useEffect, useState } from 'react'
import { X, Search, Check, Loader2, ImageIcon, RefreshCw } from 'lucide-react'

interface LibraryImage {
  name: string
  url: string
  size: number
  createdAt: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (urls: string[]) => void
  maxSelectable: number       // số ảnh còn có thể thêm
  alreadyUsed?: string[]      // URL đã có trong form (đánh dấu, không cho chọn lại)
}

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export default function ImageLibraryPicker({ open, onClose, onConfirm, maxSelectable, alreadyUsed = [] }: Props) {
  const [images, setImages] = useState<LibraryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  const usedSet = new Set(alreadyUsed)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/storage-images', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không tải được kho ảnh')
      setImages(data.images || [])
    } catch (e: any) {
      setError(e.message || 'Có lỗi khi tải kho ảnh')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setSelected(new Set())
      setQuery('')
      load()
    }
  }, [open])

  if (!open) return null

  const filtered = query.trim()
    ? images.filter(img => img.name.toLowerCase().includes(query.trim().toLowerCase()))
    : images

  function toggle(url: string) {
    if (usedSet.has(url)) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        if (next.size >= maxSelectable) return prev // đã đạt giới hạn
        next.add(url)
      }
      return next
    })
  }

  function confirm() {
    if (selected.size === 0) return
    onConfirm(Array.from(selected))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-dark">Chọn ảnh từ kho</h3>
            <p className="text-xs text-gray-400">Dùng lại ảnh đã tải lên · còn chọn được {Math.max(0, maxSelectable - selected.size)} ảnh</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-soft-gray transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên file..."
              className="w-full bg-soft-gray border-none rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="button" onClick={load} disabled={loading} className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:bg-soft-gray transition-colors disabled:opacity-50" title="Tải lại">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Đang tải kho ảnh...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ImageIcon className="w-10 h-10 mb-2 text-gray-300" />
              <p className="text-sm">{images.length === 0 ? 'Kho ảnh trống' : 'Không tìm thấy ảnh khớp'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map(img => {
                const isUsed = usedSet.has(img.url)
                const isSel = selected.has(img.url)
                return (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => toggle(img.url)}
                    disabled={isUsed}
                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all text-left ${isUsed ? 'opacity-40 cursor-not-allowed border-gray-100' : isSel ? 'border-primary ring-2 ring-primary/30' : 'border-gray-100 hover:border-primary/50'}`}
                  >
                    <div className="aspect-square bg-soft-gray">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    {(isSel || isUsed) && (
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white ${isUsed ? 'bg-gray-400' : 'bg-primary'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isUsed && (
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">Đã dùng</span>
                    )}
                    <div className="p-1.5">
                      <p className="text-[9px] text-gray-400 truncate">{formatBytes(img.size)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">Đã chọn <span className="font-bold text-dark">{selected.size}</span> ảnh</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-soft-gray transition-colors">
              Huỷ
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={selected.size === 0}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-40"
            >
              Thêm {selected.size > 0 ? `(${selected.size})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
