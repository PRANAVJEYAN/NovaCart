import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from '../api/axios'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist } from '../store/slices/wishlistSlice'

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => setProduct(res.data)).catch(() => {})
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-6 rounded-3xl bg-slate-900 p-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-slate-800">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <p className="text-sm uppercase text-emerald-300">{product.category}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-slate-300">{product.description || 'A premium product for modern shoppers.'}</p>
          <p className="text-4xl font-bold text-emerald-300">${product.price}</p>
          <div className="flex gap-3">
            <button onClick={() => { dispatch(addToCart(product)); toast.success('Added to cart') }} className="rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950">Add to cart</button>
            <button onClick={() => { dispatch(addToWishlist(product)); toast.success('Added to wishlist') }} className="rounded border border-slate-700 px-4 py-2">Add to wishlist</button>
          </div>
        </div>
      </div>
    </div>
  )
}
