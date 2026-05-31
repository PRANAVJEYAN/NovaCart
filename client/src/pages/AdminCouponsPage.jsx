import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ code: '', discount: 0, description: '', expiresAt: '', isActive: true })

  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/admin/coupons')
        setCoupons(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load coupons')
      } finally {
        setLoading(false)
      }
    }
    loadCoupons()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/coupons', form)
      setCoupons((prev) => [response.data, ...prev])
      setForm({ code: '', discount: 0, description: '', expiresAt: '', isActive: true })
      toast.success('Coupon created')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create coupon failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/coupons/${id}`)
      setCoupons((prev) => prev.filter((coupon) => coupon._id !== id))
      toast.success('Coupon removed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Admin Coupons</h1>
        <p className="mt-2 text-slate-400">Create and manage promotional coupons.</p>
      </div>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-3xl bg-slate-900 p-6 md:grid-cols-2">
        <input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Coupon code"
          required
        />
        <input
          type="number"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
          min="0"
          max="100"
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Discount %"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="col-span-2 rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Description"
          rows="3"
        />
        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Expiration date"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>
        <button type="submit" className="col-span-2 rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
          Create coupon
        </button>
      </form>

      <div className="space-y-4">
        {coupons.length === 0 && !loading ? (
          <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">No coupons created yet.</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="rounded-3xl bg-slate-900 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">{coupon.code}</p>
                  <p className="text-sm text-slate-400">{coupon.description || 'No description provided'}</p>
                  <p className="text-sm text-slate-400">Discount: {coupon.discount}% · {coupon.isActive ? 'Active' : 'Inactive'}{coupon.expiresAt ? ` · Expires ${new Date(coupon.expiresAt).toLocaleDateString()}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(coupon._id)} className="rounded bg-rose-500 px-3 py-2 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
