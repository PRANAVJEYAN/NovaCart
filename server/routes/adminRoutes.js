const express = require('express')
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const adminMiddleware = require('../middleware/admin')
const {
  getDashboard,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getUsers,
  blockUser,
  unblockUser,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/adminController')

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.use(authMiddleware, adminMiddleware)

router.get('/dashboard', getDashboard)

router.get('/products', getProducts)
router.post('/products', upload.array('images', 5), createProduct)
router.put('/products/:id', upload.array('images', 5), updateProduct)
router.delete('/products/:id', deleteProduct)

router.get('/categories', getCategories)
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

router.get('/coupons', getCoupons)
router.post('/coupons', createCoupon)
router.put('/coupons/:id', updateCoupon)
router.delete('/coupons/:id', deleteCoupon)

router.get('/orders', getOrders)
router.put('/orders/:id/status', updateOrderStatus)

router.get('/users', getUsers)
router.put('/users/:id/block', blockUser)
router.put('/users/:id/unblock', unblockUser)

module.exports = router
