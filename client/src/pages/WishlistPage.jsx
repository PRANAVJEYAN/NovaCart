import { useSelector, useDispatch } from 'react-redux'
import { removeFromWishlist } from '../store/slices/wishlistSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  const handleAddToCart = (item) => {
    dispatch(addToCart(item))
    dispatch(removeFromWishlist(item))
    toast.success('Added to cart')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="mt-2 text-slate-400">Your saved products for later.</p>
      </div>
      {items.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">Your wishlist is empty.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id || item._id} className="rounded-3xl bg-slate-900 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{item.title || item.name}</h2>
                  <p className="text-slate-400">{item.category}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleAddToCart(item)} className="rounded bg-emerald-500 px-4 py-2 text-sm">Add to cart</button>
                  <button onClick={() => dispatch(removeFromWishlist(item))} className="rounded bg-rose-500 px-4 py-2 text-sm">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
