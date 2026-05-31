import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const savedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
const savedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : ''
const initialUser = savedUser ? { ...savedUser, role: savedUser.role || savedRole } : null

const initialState = {
  user: initialUser,
  token: savedToken,
  role: initialUser?.role || savedRole,
  isAuthenticated: Boolean(initialUser && savedToken),
  redirectAfterLogin: typeof window !== 'undefined' ? localStorage.getItem('redirectAfterLogin') || null : null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/login', credentials)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('role', response.data.user.role)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed')
  }
})

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/register', userData)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    localStorage.setItem('role', response.data.user.role)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = ''
      state.isAuthenticated = false
      state.redirectAfterLogin = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      localStorage.removeItem('redirectAfterLogin')
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.role = action.payload.role
      state.isAuthenticated = Boolean(action.payload)
      localStorage.setItem('user', JSON.stringify(action.payload))
      localStorage.setItem('role', action.payload.role)
    },
    setRedirectAfterLogin: (state, action) => {
      state.redirectAfterLogin = action.payload
      localStorage.setItem('redirectAfterLogin', action.payload)
    },
    clearRedirectAfterLogin: (state) => {
      state.redirectAfterLogin = null
      localStorage.removeItem('redirectAfterLogin')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user.role
        state.isAuthenticated = true
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, setUser, setRedirectAfterLogin, clearRedirectAfterLogin } = authSlice.actions
export default authSlice.reducer
