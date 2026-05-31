const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController')

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getOrders)
router.get('/my-orders', authMiddleware, getOrders)
router.get('/:id', authMiddleware, getOrderById)

module.exports = router
