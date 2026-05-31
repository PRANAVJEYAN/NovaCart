const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' })
    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.id)
    if (!user || user.isBlocked) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authMiddleware
