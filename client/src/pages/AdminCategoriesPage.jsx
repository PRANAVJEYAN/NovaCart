import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/admin/categories')
        setCategories(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load categories')
      }
    }
    loadCategories()
  }, [])

  const createCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/categories', { name })
      setCategories((prev) => [response.data, ...prev])
      setName('')
      toast.success('Category created')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed')
    }
  }

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/admin/categories/${id}`)
      setCategories((prev) => prev.filter((category) => category._id !== id))
      toast.success('Category deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="mt-2 text-slate-400">Create and manage product categories for the storefront.</p>
      </div>
      <form onSubmit={createCategory} className="flex flex-col gap-3 rounded-3xl bg-slate-900 p-6 sm:flex-row">
        <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="New category" required />
        <button className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Add category</button>
      </form>
      <div className="grid gap-3">
        {categories.map((category) => (
          <div key={category._id} className="flex items-center justify-between rounded-3xl bg-slate-900 p-4">
            <span>{category.name}</span>
            <button onClick={() => deleteCategory(category._id)} className="rounded bg-rose-500 px-3 py-2 text-sm">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
