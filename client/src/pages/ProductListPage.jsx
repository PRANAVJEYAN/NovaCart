import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchCategories, fetchProducts, setCategory, setSearch, setSortBy } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist } from '../store/slices/wishlistSlice'

export default function ProductListPage() {
  const dispatch = useDispatch()
  const { items, categories, loading, filters } = useSelector((state) => state.products)
  const [searchValue, setSearchValue] = useState(filters.search)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(searchValue))
    }, 400)
    return () => clearTimeout(timer)
  }, [dispatch, searchValue])

  useEffect(() => {
    dispatch(fetchProducts(filters))
  }, [dispatch, filters])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-5">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Search products"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={filters.category} onChange={(e) => dispatch(setCategory(e.target.value))}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={filters.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
            <option value="featured">Featured</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <div className="rounded bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-slate-950">{items.length} products</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-800" />
        )) : items.map((product) => (
          <article key={product._id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="overflow-hidden rounded-xl bg-slate-800">
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                className="h-64 w-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs uppercase text-slate-400">{product.category}</p>
            <Link to={`/products/${product._id}`} className="mt-2 block font-semibold">{product.name}</Link>
            <p className="mt-2 text-emerald-300">${product.price}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { dispatch(addToCart(product)); toast.success('Added to cart') }} className="flex-1 rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Add To Cart</button>
              <button onClick={() => { dispatch(addToWishlist(product)); toast.success('Added to wishlist') }} className="rounded border border-slate-700 px-3 py-2 text-sm">♡</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
