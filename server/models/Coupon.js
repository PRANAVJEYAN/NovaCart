const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  description: { type: String, default: '' },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Coupon', couponSchema)
