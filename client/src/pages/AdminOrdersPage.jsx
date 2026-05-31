import { useEffect, useState } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']
const PAYMENT_STATUS_OPTIONS = ['Pending', 'Paid', 'Failed', 'Refunded']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await axios.get('/api/admin/orders')
        setOrders(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load orders')
      }
    }
    loadOrders()
  }, [])

  const updateStatus = async (orderId, updates) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}/status`, updates)
      setOrders((prev) => prev.map((order) => (order._id === orderId ? response.data : order)))
      toast.success('Order updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <p className="mt-2 text-slate-400">Review order progress and update status for fulfillment.</p>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-3xl bg-slate-900 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <p className="text-sm text-slate-400">Order #{order._id}</p>
                <p className="font-semibold">{order.userId?.name || 'Guest'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Total</p>
                <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-400">Status</span>
                <select value={order.status} onChange={(e) => updateStatus(order._id, { status: e.target.value })} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-400">Payment status</span>
                <select value={order.paymentStatus} onChange={(e) => updateStatus(order._id, { paymentStatus: e.target.value })} className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
