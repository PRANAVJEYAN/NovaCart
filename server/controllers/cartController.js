const Cart = require('../models/Cart')

exports.getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user.id }).populate('productId')
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart' })
  }
}

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const item = await Cart.findOneAndUpdate(
      { userId: req.user.id, productId },
      { $inc: { quantity: quantity || 1 } },
      { upsert: true, new: true }
    )
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' })
  }
}

exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.json({ message: 'Removed' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove cart item' })
  }
}
