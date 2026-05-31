const Product = require('../models/Product')
const Category = require('../models/Category')
const Order = require('../models/Order')
const User = require('../models/User')
const Coupon = require('../models/Coupon')
const { uploadImages } = require('../services/cloudinaryService')

const normalizeImageField = (images) => {
  if (!images) return []
  return Array.isArray(images) ? images : [images]
}

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalAmount' } } },
    ])
    const revenueSummary = revenueResult[0]?.revenue || 0
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email')

    res.json({ totalProducts, totalOrders, totalUsers, revenueSummary, recentOrders })
  } catch (err) {
    res.status(500).json({ message: 'Could not load admin dashboard' })
  }
}

exports.getProducts = async (req, res) => {
  try {
    const { search, category, active } = req.query
    const filter = {}
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
      ]
    }
    if (category) filter.category = category
    if (active !== undefined) filter.isActive = active === 'true'

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load products' })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const files = req.files || []
    const imageUrls = files.length ? await uploadImages(files) : []
    const payload = {
      ...req.body,
      name: req.body.name || req.body.title,
      title: req.body.title || req.body.name,
      images: [...normalizeImageField(req.body.images), ...imageUrls],
      stock: Number(req.body.stock || 0),
      price: Number(req.body.price || 0),
      rating: Number(req.body.rating || 0),
      featured: req.body.featured === 'true' || req.body.featured === true,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    }
    const product = await Product.create(payload)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Product creation failed' })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const files = req.files || []
    const imageUrls = files.length ? await uploadImages(files) : []
    const payload = {
      ...req.body,
      name: req.body.name || req.body.title,
      title: req.body.title || req.body.name,
    }
    const incomingImages = normalizeImageField(req.body.images)
    if (incomingImages.length || imageUrls.length) {
      payload.images = [...incomingImages, ...imageUrls]
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Product update failed' })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: 'Product delete failed' })
  }
}

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load coupons' })
  }
}

exports.createCoupon = async (req, res) => {
  try {
    const payload = {
      code: req.body.code,
      discount: Number(req.body.discount || 0),
      description: req.body.description || '',
      expiresAt: req.body.expiresAt || undefined,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    }
    const coupon = await Coupon.create(payload)
    res.status(201).json(coupon)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Coupon creation failed' })
  }
}

exports.updateCoupon = async (req, res) => {
  try {
    const payload = {
      code: req.body.code,
      discount: Number(req.body.discount || 0),
      description: req.body.description || '',
      expiresAt: req.body.expiresAt || undefined,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    }
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.json(coupon)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Coupon update failed' })
  }
}

exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ message: 'Coupon removed' })
  } catch (err) {
    res.status(500).json({ message: 'Coupon delete failed' })
  }
}

exports.getCategories = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: 'Product delete failed' })
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load categories' })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Category creation failed' })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Category update failed' })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category removed' })
  } catch (err) {
    res.status(500).json({ message: 'Category delete failed' })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load orders' })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (status) order.status = status
    if (paymentStatus) order.paymentStatus = paymentStatus
    await order.save()
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Order status update failed' })
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users' })
  }
}

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user' })
  }
}

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Failed to unblock user' })
  }
}
