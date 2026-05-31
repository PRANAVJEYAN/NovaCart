const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

productSchema.pre('save', function (next) {
  if (!this.name && this.title) this.name = this.title
  if (!this.title && this.name) this.title = this.name
  next()
})

module.exports = mongoose.model('Product', productSchema)
