import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialCart = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []

const initialState = {
  items: initialCart,
}

export const fetchServerCart = createAsyncThunk('cart/fetchServerCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/cart')
    // response.data is array of cart items with populated productId
    const items = response.data.map((entry) => ({
      _id: entry.productId._id,
      name: entry.productId.name || entry.productId.title,
      price: entry.productId.price,
      quantity: entry.quantity,
      images: entry.productId.images || (entry.productId.image ? [entry.productId.image] : []),
    }))
    return items
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find((entry) => entry._id === item._id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload
      const item = state.items.find((entry) => entry._id === _id)
      if (item) {
        item.quantity = quantity
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchServerCart.fulfilled, (state, action) => {
      state.items = action.payload || []
      localStorage.setItem('cart', JSON.stringify(state.items))
    })
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
