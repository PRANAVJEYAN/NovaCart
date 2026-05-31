import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiHome, FiShoppingBag, FiShoppingCart, FiHeart } from 'react-icons/fi'
import { logout } from '../store/slices/authSlice'
import { clearCart } from '../store/slices/cartSlice'
import { clearWishlist } from '../store/slices/wishlistSlice'

export default function Layout({ children }) {
  const [openMenu, setOpenMenu] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Shop', path: '/products', icon: FiShoppingBag },
    { name: 'Cart', path: '/cart', icon: FiShoppingCart },
  ]
  const wishlistNavItem = { name: 'Wishlist', path: '/wishlist', icon: FiHeart }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">NovaCart</Link>
          <nav className="hidden lg:flex gap-6 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={location.pathname === item.path ? 'text-white' : ''}>{item.name}</Link>
            ))}
            {user && <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'text-white' : ''}>Wishlist</Link>}
          </nav>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs">{items.length} items</span>
            {!user && (
              <div className="flex gap-2">
                <Link to="/login" className="rounded border border-slate-700 px-3 py-2 text-sm">Login</Link>
                <Link to="/signup" className="rounded bg-emerald-500 px-3 py-2 text-sm">Signup</Link>
              </div>
            )}
            {user && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="rounded border border-slate-700 px-3 py-2 text-sm">Admin Panel</Link>
                  )}
                  <button
                    onClick={() => setOpenMenu((prev) => !prev)}
                    className="flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  >
                    <span className="h-7 w-7 rounded-full bg-emerald-500 text-center leading-7 text-xs uppercase">{user.name?.charAt(0) || 'U'}</span>
                    <span>{user.name || user.email}</span>
                  </button>
                </div>
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-800 bg-slate-900 p-2 text-sm shadow-xl">
                    <Link
                      to={user.role === 'admin' ? '/admin/profile' : '/profile'}
                      className="block rounded px-3 py-2 text-slate-200 hover:bg-slate-800"
                      onClick={() => setOpenMenu(false)}
                    >
                      Profile
                    </Link>
                    {user.role !== 'admin' && (
                      <>
                        <Link to="/orders" className="block rounded px-3 py-2 text-slate-200 hover:bg-slate-800" onClick={() => setOpenMenu(false)}>My Orders</Link>
                        <Link to="/wishlist" className="block rounded px-3 py-2 text-slate-200 hover:bg-slate-800" onClick={() => setOpenMenu(false)}>Wishlist</Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setOpenMenu(false)
                        dispatch(logout())
                        dispatch(clearCart())
                        dispatch(clearWishlist())
                      }}
                      className="mt-2 w-full rounded bg-rose-500 px-3 py-2 text-left text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24">{children}</main>
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-slate-300">
          {[...navItems, ...(user ? [wishlistNavItem] : [])].map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition ${isActive ? 'text-white bg-slate-900' : 'hover:text-white hover:bg-slate-900/70'}`}
              >
                <Icon className="text-lg" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">© 2026 NovaCart</footer>
    </div>
  )
}
