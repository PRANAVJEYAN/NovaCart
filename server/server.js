require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

// Enforce critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required')
  process.exit(1)
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error('FATAL: ADMIN_EMAIL and ADMIN_PASSWORD must be set in production')
    process.exit(1)
  }
}
const Product = require('./models/Product')
const Category = require('./models/Category')
const User = require('./models/User')
const bcrypt = require('bcryptjs')

connectDB()
  .then(async () => {
    const categoryCount = await Category.countDocuments()
    if (categoryCount === 0) {
      await Category.insertMany([
        { name: 'electronics' },
        { name: 'jewelery' },
        { name: "men's clothing" },
        { name: "women's clothing" },
      ])
    }

    const productCount = await Product.countDocuments()
    if (productCount === 0) {
      await Product.insertMany([
        { title: 'Wireless Headphones', name: 'Wireless Headphones', description: 'Premium wireless headphones', price: 129, category: 'electronics', brand: 'NovaSound', stock: 34, images: ['https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'], rating: 4.8, featured: true, isActive: true },
        { title: 'Classic Leather Jacket', name: 'Classic Leather Jacket', description: 'Modern leather jacket', price: 89, category: "men's clothing", brand: 'UrbanWear', stock: 22, images: ['https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'], rating: 4.7, featured: false, isActive: true },
        { title: 'Diamond Ring', name: 'Diamond Ring', description: 'Elegant diamond ring', price: 199, category: 'jewelery', brand: 'LuxeGem', stock: 12, images: ['https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg'], rating: 4.9, featured: true, isActive: true },
        { title: 'Cotton T-Shirt', name: 'Cotton T-Shirt', description: 'Soft cotton tee', price: 29, category: "women's clothing", brand: 'ComfortFit', stock: 48, images: ['https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg'], rating: 4.4, featured: false, isActive: true },
      ])
    }

    const adminExists = await User.exists({ role: 'admin' })
    if (!adminExists && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hash,
        role: 'admin',
      })
      if (process.env.NODE_ENV !== 'production') {
        console.log('Default admin created from env variables')
      }
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err)
    process.exit(1)
  })
