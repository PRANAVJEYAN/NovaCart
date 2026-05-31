import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signup, clearRedirectAfterLogin } from '../store/slices/authSlice'
import { fetchServerCart } from '../store/slices/cartSlice'
import { fetchServerWishlist } from '../store/slices/wishlistSlice'

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, redirectAfterLogin } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const returnTo = location.state?.from || redirectAfterLogin || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(signup(form))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created')
      dispatch(clearRedirectAfterLogin())
      // load server-side cart and wishlist for authenticated user
      dispatch(fetchServerCart())
      dispatch(fetchServerWishlist())
      navigate(returnTo, { replace: true })
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      <p className="mt-1 text-sm text-slate-400">Join NovaCart and start shopping.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950" disabled={loading}>{loading ? 'Creating...' : 'Sign up'}</button>
      </form>
    </div>
  )
}
