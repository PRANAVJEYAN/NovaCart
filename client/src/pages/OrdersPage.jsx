import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/orders/my-orders')
        setOrders(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load orders')
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-2 text-slate-400">Review your orders and track shipment status.</p>
      </div>
      {loading ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">You have no orders yet.</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl bg-slate-900 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Order ID: {order._id}</p>
                  <h2 className="text-xl font-semibold">{order.status}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
                <span className="rounded-full bg-slate-800 px-3 py-1">{order.paymentMethod}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">{order.paymentStatus}</span>
                <span className="rounded-full bg-slate-800 px-3 py-1">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <Link to={`/orders/${order._id}`} className="mt-4 inline-flex rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">View details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
