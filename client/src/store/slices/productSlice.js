import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
  items: [],
  categories: [],
  featured: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    sortBy: 'featured',
  },
}

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ search, category, sortBy }, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    if (sortBy) params.append('sortBy', sortBy)
    const response = await axios.get(`/api/products?${params.toString()}`)
    return response.data
  } catch (error) {
    try {
      const fallback = await axios.get('https://fakestoreapi.com/products')
      let products = fallback.data.map((item) => ({
        _id: item.id,
        name: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        images: item.image ? [item.image] : [],
        rating: item.rating?.rate || 4.5,
      }))

      if (search) {
        products = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
      }
      if (category) {
        products = products.filter((product) => product.category === category)
      }
      if (sortBy === 'price_asc') {
        products.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price_desc') {
        products.sort((a, b) => b.price - a.price)
      } else if (sortBy === 'rating') {
        products.sort((a, b) => b.rating - a.rating)
      }

      return { products }
    } catch (fallbackError) {
      return rejectWithValue(fallbackError.response?.data?.message || 'Failed to load products')
    }
  }
})

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/categories')
    return response.data
  } catch (error) {
    try {
      const fallback = await axios.get('https://fakestoreapi.com/products/categories')
      return fallback.data.map((name) => ({ _id: name, name }))
    } catch (fallbackError) {
      return rejectWithValue(fallbackError.response?.data?.message || 'Failed to load categories')
    }
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filters.search = action.payload
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products || []
        state.featured = (action.payload.products || []).slice(0, 6)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setSearch, setCategory, setSortBy } = productSlice.actions
export default productSlice.reducer
