const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  addresses: [
    {
      label: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  ],
  lastLogin: { type: Date },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
