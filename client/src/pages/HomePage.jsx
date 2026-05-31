import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchCategories, fetchProducts } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist } from '../store/slices/wishlistSlice'

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, featured, categories, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ sortBy: 'featured' }))
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-3xl bg-gradient-to-br from-emerald-500/80 via-slate-900 to-slate-800 p-6 md:grid-cols-2 md:p-10">
        <div className="space-y-4">
          <p className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em]">New season collection</p>
          <h1 className="text-4xl font-bold md:text-6xl">Style, speed, and savings in one cart.</h1>
          <p className="max-w-xl text-slate-200">Discover curated essentials across fashion, tech, home, and lifestyle with a modern storefront built for growth.</p>
          <div className="flex gap-3">
            <Link to="/products" className="rounded bg-white px-4 py-2 font-semibold text-slate-900">Explore products</Link>
            <Link to="/checkout" className="rounded border border-white/20 px-4 py-2">Checkout</Link>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl bg-slate-900/70 p-4">
          {featured.slice(0, 4).map((product) => (
            <div key={product._id} className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-slate-400">{product.category}</p>
                </div>
              </div>
              <p className="text-emerald-400">${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Categories</p>
            <h2 className="text-2xl font-bold">Browse by category</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category._id} to={`/products?category=${category.name}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-emerald-400">
              <p className="text-lg font-semibold capitalize">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Trending</p>
            <h2 className="text-2xl font-bold">Top picks right now</h2>
          </div>
          <Link to="/products" className="text-sm text-emerald-300">View all</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {loading ? 'Loading...' : items.slice(0,8).map((product) => (
            <article key={product._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-3 overflow-hidden rounded-xl bg-slate-800">
                <img
                  src={product.images?.[0] || product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover"
                />
              </div>
              <p className="text-xs uppercase text-slate-400">{product.category}</p>
              <h3 className="mt-2 font-semibold">{product.name}</h3>
              <p className="mt-2 text-emerald-300">${product.price}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { dispatch(addToCart(product)); toast.success('Added to cart') }} className="flex-1 rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Add to Cart</button>
                <button onClick={() => { dispatch(addToWishlist(product)); toast.success('Added to wishlist') }} className="rounded border border-slate-700 px-3 py-2 text-sm">♡</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
