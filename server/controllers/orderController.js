const Order = require('../models/Order')
const Product = require('../models/Product')

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod = 'cod',
      subtotal,
      tax = 0,
      shippingCharge = 0,
      totalAmount,
    } = req.body

    if (!products || !products.length) {
      return res.status(400).json({ message: 'Cart must contain at least one product' })
    }

    const orderItems = []
    for (const item of products) {
      const product = await Product.findById(item.productId)
      if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` })
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` })
      }
      product.stock -= item.quantity
      await product.save()
      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: item.price,
      })
    }

    const order = await Order.create({
      userId: req.user.id,
      products: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCharge,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
    })

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed' })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
}
