const createOrder = async ({ amount, currency = 'INR', provider = 'mock' }) => {
  const orderId = `pay_${Date.now()}`
  return {
    provider,
    orderId,
    amount,
    currency,
    status: 'created',
  }
}

const verifyPayment = async ({ provider, orderId, payload }) => {
  return {
    provider,
    orderId,
    verified: true,
    payload,
  }
}

module.exports = { createOrder, verifyPayment }
