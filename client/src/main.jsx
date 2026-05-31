import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'
import { store } from './store/store'
import axios from './api/axios'
import { setUser, logout } from './store/slices/authSlice'
import { fetchServerCart } from './store/slices/cartSlice'
import { fetchServerWishlist } from './store/slices/wishlistSlice'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

// Validate token and hydrate profile/cart/wishlist on app start
;(async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    try {
      const response = await axios.get('/api/auth/profile')
      store.dispatch(setUser(response.data))
      store.dispatch(fetchServerCart())
      store.dispatch(fetchServerWishlist())
    } catch (err) {
      store.dispatch(logout())
    }
  }
})()
