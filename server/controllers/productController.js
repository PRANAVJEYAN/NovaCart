const Product = require('../models/Product')

exports.getProducts = async (req, res) => {
  try {
    const { search, category, sortBy } = req.query
    const filter = {}
    if (search) filter.name = new RegExp(search, 'i')
    if (category) filter.category = category

    let query = Product.find(filter)

    if (sortBy === 'price_asc') query = query.sort({ price: 1 })
    if (sortBy === 'price_desc') query = query.sort({ price: -1 })
    if (sortBy === 'rating') query = query.sort({ rating: -1 })

    const products = await query
    res.json({ products })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
}

exports.createProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      name: req.body.name || req.body.title,
      title: req.body.title || req.body.name,
      images: req.body.images || (req.body.image ? [req.body.image] : []),
    }
    const product = await Product.create(payload)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: 'Product creation failed' })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      name: req.body.name || req.body.title,
      title: req.body.title || req.body.name,
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Product update failed' })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Product delete failed' })
  }
}
