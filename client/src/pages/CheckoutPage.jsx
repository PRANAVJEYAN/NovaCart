import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from '../api/axios'
import { clearCart } from '../store/slices/cartSlice'

export default function CheckoutPage() {
  const { items } = useSelector((state) => state.cart)
  const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '', postalCode: '' })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Number((subtotal * 0.05).toFixed(2))
  const shippingCharge = subtotal > 100 ? 0 : 5
  const total = subtotal + tax + shippingCharge

  const handleChange = (key, value) => setShipping((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.postalCode) {
      return toast.error('Please complete shipping details')
    }
    setLoading(true)
    try {
      await axios.post('/api/orders', {
        products: items.map((item) => ({ productId: item._id, quantity: item.quantity, price: item.price })),
        shippingAddress: shipping,
        paymentMethod,
        subtotal,
        tax,
        shippingCharge,
        totalAmount: total,
      })
      dispatch(clearCart())
      toast.success('Order placed successfully')
      navigate('/checkout-success')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-slate-900 p-5">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={shipping.name} onChange={(e) => handleChange('name', e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Full name" />
          <input value={shipping.email} onChange={(e) => handleChange('email', e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Email" />
          <input value={shipping.address} onChange={(e) => handleChange('address', e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2 md:col-span-2" placeholder="Shipping address" />
          <input value={shipping.city} onChange={(e) => handleChange('city', e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="City" />
          <input value={shipping.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Postal code" />
        </div>
        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="font-semibold">Payment method</p>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={paymentMethod === 'mock_online'} onChange={() => setPaymentMethod('mock_online')} />
              Mock Online Payment
            </label>
          </div>
          <p className="mt-2 text-sm text-slate-300">Current payment integration supports Cash on Delivery and mock payments. Online provider support is ready to extend.</p>
        </div>
      </form>
      <div className="rounded-3xl bg-slate-900 p-5">
        <h2 className="text-xl font-bold">Payment summary</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>${shippingCharge.toFixed(2)}</span></div>
        </div>
        <div className="mt-4 border-t border-slate-700 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button type="button" onClick={handleSubmit} className="mt-4 w-full rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950" disabled={loading || items.length === 0}>{loading ? 'Placing order...' : 'Place Order'}</button>
      </div>
    </div>
  )
}
