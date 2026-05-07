'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}

interface Props {
  categories: Category[] // All categories
  initialCategoryId?: string // This is the categoryId stored in the Product
}

export default function CategorySubCategorySelect({ 
  categories, 
  initialCategoryId = '' 
}: Props) {
  const [selectedParentId, setSelectedParentId] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')
  
  const rootCategories = categories.filter(c => !c.parentId)

  useEffect(() => {
    if (initialCategoryId) {
      const current = categories.find(c => c.id === initialCategoryId)
      if (current) {
        if (current.parentId) {
          // It's a sub-category
          setSelectedParentId(current.parentId)
          setSelectedChildId(current.id)
        } else {
          // It's a root category
          setSelectedParentId(current.id)
          setSelectedChildId('')
        }
      }
    }
  }, [initialCategoryId, categories])

  const availableChildren = categories.filter(c => c.parentId === selectedParentId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <input type="hidden" name="categoryId" value={selectedChildId || selectedParentId} />
      
      <div>
        <label className="block text-sm font-bold text-dark mb-2">Danh mục chính *</label>
        <select 
          required 
          value={selectedParentId}
          onChange={(e) => {
            setSelectedParentId(e.target.value)
            setSelectedChildId('')
          }}
          className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Chọn danh mục chính</option>
          {rootCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-dark mb-2">Danh mục phụ (Nếu có)</label>
        <select 
          value={selectedChildId}
          onChange={(e) => setSelectedChildId(e.target.value)}
          disabled={!selectedParentId || availableChildren.length === 0}
          className="w-full bg-soft-gray border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        >
          <option value="">-- Không có danh mục phụ --</option>
          {availableChildren.map((sub) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        {selectedParentId && availableChildren.length === 0 && (
            <p className="text-[10px] text-gray-400 mt-1">Danh mục này không có danh mục con.</p>
        )}
      </div>
    </div>
  )
}
