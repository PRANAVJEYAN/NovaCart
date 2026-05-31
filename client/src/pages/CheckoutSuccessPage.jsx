import { Link } from 'react-router-dom'

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-slate-900 p-8 text-center">
      <h1 className="text-3xl font-bold text-emerald-300">Order confirmed!</h1>
      <p className="mt-4 text-slate-300">Thank you for your purchase. Your order is being processed and will arrive soon.</p>
      <Link to="/orders" className="mt-8 inline-flex rounded bg-white px-6 py-3 font-semibold text-slate-950">View my orders</Link>
    </div>
  )
}
