import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { logout } from '../store/slices/authSlice'

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/admin/dashboard')
        setDashboard(response.data)
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load dashboard'
        setError(message)
        toast.error(message)
        if ([401, 403].includes(err.response?.status)) {
          dispatch(logout())
          navigate('/login', { replace: true })
        }
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [dispatch, navigate])

  if (loading) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading admin dashboard…</div>
  }

  if (error) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-rose-400">{error}</div>
  }

  if (!dashboard) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">No dashboard data available.</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Overview of products, orders, users and revenue.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-slate-900 p-6">
          <p className="text-sm uppercase text-slate-400">Products</p>
          <p className="mt-3 text-3xl font-bold">{dashboard.totalProducts}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <p className="text-sm uppercase text-slate-400">Orders</p>
          <p className="mt-3 text-3xl font-bold">{dashboard.totalOrders}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <p className="text-sm uppercase text-slate-400">Users</p>
          <p className="mt-3 text-3xl font-bold">{dashboard.totalUsers}</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <p className="text-sm uppercase text-slate-400">Revenue</p>
          <p className="mt-3 text-3xl font-bold">${dashboard.revenueSummary.toFixed(2)}</p>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-bold">Recent orders</h2>
        <div className="mt-4 space-y-3">
          {dashboard.recentOrders.map((order) => (
            <div key={order._id} className="rounded-2xl bg-slate-800 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold">{order.userId?.name || 'Unknown customer'}</p>
                  <p className="text-sm text-slate-400">Order #{order._id}</p>
                </div>
                <p className="text-sm text-slate-300">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
