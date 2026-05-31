import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialWishlist = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('wishlist') || '[]') : []

export const fetchServerWishlist = createAsyncThunk('wishlist/fetchServerWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/wishlist')
    const items = response.data.map((entry) => ({
      _id: entry.productId._id,
      name: entry.productId.name || entry.productId.title,
      price: entry.productId.price,
      images: entry.productId.images || (entry.productId.image ? [entry.productId.image] : []),
    }))
    return items
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist')
  }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: initialWishlist,
  },
  reducers: {
    addToWishlist: (state, action) => {
      if (!state.items.find((item) => item._id === action.payload._id)) {
        state.items.push(action.payload)
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('wishlist')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServerWishlist.fulfilled, (state, action) => {
      state.items = action.payload || []
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    })
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
