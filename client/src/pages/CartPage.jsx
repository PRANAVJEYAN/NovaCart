import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice'

export default function CartPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 rounded-2xl bg-slate-900 p-4">
            <div className="h-20 w-20 rounded-xl bg-slate-800" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-400">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: Math.max(1, item.quantity - 1) }))} className="rounded bg-slate-800 px-2">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))} className="rounded bg-slate-800 px-2">+</button>
            </div>
            <button onClick={() => { dispatch(removeFromCart(item._id)); toast.success('Removed from cart') }} className="rounded bg-rose-500 px-3 py-2 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-slate-900 p-5">
        <h2 className="text-xl font-bold">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-300">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
        </div>
        <div className="mt-4 border-t border-slate-700 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="mt-4 block rounded bg-emerald-500 px-4 py-2 text-center font-semibold text-slate-950">Proceed to checkout</Link>
      </div>
    </div>
  )
}
