import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    rating: 4.5,
    featured: false,
    isActive: true,
    newImageUrl: '',
    existingImages: [],
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/admin/products')
        setProducts(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const resetForm = () =>
    setForm({
      name: '',
      title: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      stock: 0,
      rating: 4.5,
      featured: false,
      isActive: true,
      newImageUrl: '',
      existingImages: [],
    })

  const handleAddImage = () => {
    const url = form.newImageUrl.trim()
    if (!url) {
      toast.error('Enter a valid image URL')
      return
    }
    if (form.existingImages.includes(url)) {
      toast.error('Image URL already added')
      return
    }
    setForm((prev) => ({
      ...prev,
      existingImages: [...prev.existingImages, url],
      newImageUrl: '',
    }))
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    if (!form.existingImages.length) {
      toast.error('Add at least one image URL')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('category', form.category)
      formData.append('brand', form.brand)
      formData.append('stock', form.stock)
      formData.append('rating', form.rating)
      formData.append('featured', form.featured)
      formData.append('isActive', form.isActive)
      form.existingImages.forEach((url) => formData.append('images', url))

      if (editingId) {
        const response = await axios.put(`/api/admin/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setProducts((prev) => prev.map((product) => (product._id === editingId ? response.data : product)))
        toast.success('Product updated')
      } else {
        const response = await axios.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setProducts((prev) => [response.data, ...prev])
        toast.success('Product created')
      }

      resetForm()
      setEditingId(null)
    } catch (err) {
      toast.error(err.response?.data?.message || (editingId ? 'Update product failed' : 'Create product failed'))
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/products/${id}`)
      setProducts((prev) => prev.filter((product) => product._id !== id))
      toast.success('Product deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setForm({
      name: product.name || '',
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock || 0,
      rating: product.rating || 4.5,
      featured: product.featured || false,
      isActive: product.isActive ?? true,
      newImageUrl: '',
      existingImages: product.images || [],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRemoveExistingImage = (url) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((imageUrl) => imageUrl !== url),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <p className="mt-2 text-slate-400">Create, edit, and remove products from the catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl bg-slate-900 p-6 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Product name"
          required
        />
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Product title"
        />
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Category"
          required
        />
        <input
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Brand"
        />
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Price"
          required
        />
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Stock"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="col-span-2 rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Description"
          rows="3"
        />

        <div className="col-span-2 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={form.newImageUrl}
            onChange={(e) => setForm({ ...form, newImageUrl: e.target.value })}
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Image URL"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Add image
          </button>
        </div>

        {form.existingImages.length > 0 && (
          <div className="col-span-2 flex flex-wrap gap-3">
            {form.existingImages.map((url) => (
              <div key={url} className="flex items-center gap-3 rounded bg-slate-800 p-3">
                <img src={url} alt="preview" className="h-16 w-16 rounded object-cover" />
                <div className="flex flex-col gap-2">
                  <span className="max-w-xs truncate text-sm text-slate-200">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="rounded bg-rose-500 px-3 py-1 text-sm text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="col-span-2 flex flex-wrap gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>

        <div className="col-span-2 flex gap-3">
          <button
            type="submit"
            className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            {editingId ? 'Update product' : 'Create product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                resetForm()
                setEditingId(null)
              }}
              className="rounded bg-slate-800 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product._id} className="rounded-3xl bg-slate-900 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center gap-4">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="h-20 w-20 rounded-2xl object-cover" />
                )}
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-400">Category: {product.category} · Stock: {product.stock}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(product)} className="rounded bg-amber-500 px-3 py-2 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="rounded bg-rose-500 px-3 py-2 text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
