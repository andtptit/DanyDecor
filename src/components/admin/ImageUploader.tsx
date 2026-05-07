'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  name?: string
  maxImages?: number
  initialImages?: string[]
}

interface UploadedImage {
  url: string
  isExisting?: boolean
}

export default function ImageUploader({ name = 'images', maxImages = 6, initialImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    initialImages.map(url => ({ url, isExisting: true }))
  )
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return { url: data.url }
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    const remaining = maxImages - images.length
    if (remaining <= 0) { setError(`Tối đa ${maxImages} ảnh`); return }
    const filesToUpload = Array.from(files).slice(0, remaining)
    setUploading(true)
    try {
      const results = await Promise.all(filesToUpload.map(async (file) => {
        if (!file.type.startsWith('image/')) throw new Error(`${file.name} không phải ảnh`)
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} vượt quá 5MB`)
        return uploadFile(file)
      }))
      setImages(prev => [...prev, ...(results.filter(Boolean) as UploadedImage[])])
    } catch (err: any) {
      setError(err.message || 'Có lỗi khi tải ảnh lên')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [images.length, maxImages])

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={images.map(img => img.url).join(',')} />

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-200 bg-soft-gray hover:border-primary/50 hover:bg-primary/5'} ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <><Loader2 className="w-10 h-10 text-primary animate-spin" /><p className="text-sm font-semibold text-primary">Đang tải ảnh lên...</p></>
            ) : (
              <>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">Kéo thả ảnh vào đây hoặc <span className="text-primary">bấm để chọn</span></p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — tối đa 5MB mỗi ảnh, tối đa {maxImages} ảnh</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span> {error}</p>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => removeImage(i)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
              {i === 0 && <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Ảnh chính</span>}
            </div>
          ))}
          {images.length < maxImages && (
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors">
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs font-semibold">Thêm ảnh</span>
            </button>
          )}
        </div>
      )}

      {images.length > 0 && <p className="text-xs text-gray-400">{images.length}/{maxImages} ảnh</p>}
    </div>
  )
}
