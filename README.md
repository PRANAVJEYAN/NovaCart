# 🛒 NovaCart

A modern, responsive E-Commerce Platform built with **React JS + Vite**, featuring product browsing, authentication, cart management, wishlist functionality, Redux Toolkit state management, and a seamless shopping experience.

## 🚀 Live Demo

```text
https://nova-cart-client.vercel.app
```

## 📂 GitHub Repository

```text
https://github.com/PRANAVJEYAN/NovaCart
```

---

# ✨ Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Persistent Login Sessions

## Home Page

* Hero Banner
* Featured Products
* Categories Section
* Responsive Navigation
* Footer

## Product Management

* Product Listing
* Product Search
* Category Filtering
* Product Sorting
* Product Details Page

## Cart

* Add to Cart
* Remove from Cart
* Update Quantity
* Cart Total Calculation
* Persistent Cart State

## Wishlist

* Add to Wishlist
* Remove from Wishlist
* Persistent Wishlist

## Checkout

* Shipping Information Form
* Order Summary
* Checkout UI Flow

## Additional Features

* Redux Toolkit
* Responsive Design
* Lazy Loading
* Code Splitting
* Toast Notifications
* Theme Switcher
* Protected Routes
* Debounced Search
* Framer Motion Animations

---

# 🛠 Tech Stack

### Frontend

* React JS
* Vite JS
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios
* React Hot Toast
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

### Database

* MongoDB Atlas

---

# 📦 Redux Toolkit Structure

```text
store/
├── authSlice
├── productSlice
├── cartSlice
└── wishlistSlice
```

### authSlice

* Login
* Signup
* Logout
* User Authentication State

### productSlice

* Products
* Categories
* Filters
* Search
* Sorting

### cartSlice

* Cart Items
* Quantity Management
* Cart Totals

### wishlistSlice

* Wishlist Management

---

# 📁 Project Structure

## Frontend

```text
src/
├── api/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   └── wishlist/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── utils/
└── main.jsx
```

## Backend

```text
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validations/
├── app.js
└── server.js
```

---

# 🔌 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

## Products

```http
GET /api/products
GET /api/products/:id
GET /api/categories
```

## Cart

```http
GET /api/cart
POST /api/cart
DELETE /api/cart/:id
```

## Wishlist

```http
GET /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/:id
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/PRANAVJEYAN/NovaCart.git
```

## Navigate to Project

```bash
cd NovaCart
```

## Install Frontend Dependencies

```bash
cd client
npm install
```

## Start Frontend

```bash
npm run dev
```

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

# 📱 Responsive Design

NovaCart is optimized for:

* Mobile Devices
* Tablets
* Laptops
* Desktop Screens

---

# 🎯 Future Improvements

* Order Tracking
* Product Reviews
* Admin Dashboard
* Analytics Dashboard
* Coupon System
* Inventory Management

---

# 👨‍💻 Author

**V. Pranav Jeyan**

GitHub:

```text
https://github.com/PRANAVJEYAN
```

LinkedIn:

```text
https://www.linkedin.com/in/pranav-jeyan/
```

---

# 📄 License

This project is developed for educational, learning, and portfolio purposes.

MIT License © 2026 V. Pranav Jeyan
