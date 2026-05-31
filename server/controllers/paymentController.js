const paymentService = require('../services/paymentService')

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, provider } = req.body
    if (!amount) return res.status(400).json({ message: 'Amount is required' })

    const order = await paymentService.createOrder({ amount, currency, provider })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Payment creation failed' })
  }
}

exports.verifyPayment = async (req, res) => {
  try {
    const { provider, orderId, payload } = req.body
    const result = await paymentService.verifyPayment({ provider, orderId, payload })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message || 'Payment verification failed' })
  }
}
