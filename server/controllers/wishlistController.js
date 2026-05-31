const Wishlist = require('../models/Wishlist')

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id }).populate('productId')
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' })
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const item = await Wishlist.findOneAndUpdate(
      { userId: req.user.id, productId },
      { userId: req.user.id, productId },
      { upsert: true, new: true }
    )
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update wishlist' })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id)
    res.json({ message: 'Removed' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove wishlist item' })
  }
}
