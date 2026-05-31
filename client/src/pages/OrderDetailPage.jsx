import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/orders/${id}`)
        setOrder(response.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Order not found')
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  if (loading || !order) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Loading order...</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Order details</h1>
        <p className="mt-2 text-slate-400">Order ID: {order._id}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 rounded-3xl bg-slate-900 p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Shipping</h2>
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.email}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.postalCode}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Status</h2>
            <p>{order.status}</p>
            <p>{order.paymentStatus}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Items</h2>
            {order.products.map((item) => (
              <div key={item.productId} className="rounded-2xl bg-slate-800 p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-400">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Payment summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${order.shippingCharge.toFixed(2)}</span></div>
          </div>
          <div className="mt-4 border-t border-slate-700 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Link to="/orders" className="inline-flex rounded bg-slate-800 px-4 py-2 text-sm text-slate-200">Back to orders</Link>
    </div>
  )
}
