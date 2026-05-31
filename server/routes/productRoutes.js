const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const adminMiddleware = require('../middleware/admin')
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

module.exports = router
