const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController')

router.get('/', authMiddleware, getWishlist)
router.post('/', authMiddleware, addToWishlist)
router.delete('/:id', authMiddleware, removeFromWishlist)

module.exports = router
