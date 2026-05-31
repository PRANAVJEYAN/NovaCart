import { NavLink, Outlet } from 'react-router-dom'

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Orders', path: '/admin/orders' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Categories', path: '/admin/categories' },
  { label: 'Coupons', path: '/admin/coupons' },
  { label: 'Profile', path: '/admin/profile' },
]

export default function AdminLayout() {
  return (
    <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
      <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-3">
          {adminLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `rounded-2xl border px-4 py-2 text-sm ${isActive ? 'border-emerald-500 bg-emerald-500 text-slate-950' : 'border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <section className="rounded-3xl border border-slate-800 bg-slate-950/5 p-6">
        <Outlet />
      </section>
    </div>
  )
}
