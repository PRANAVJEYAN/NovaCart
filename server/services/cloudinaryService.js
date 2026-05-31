const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadImage = async (file) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary configuration missing')
  }

  const base64 = file.buffer.toString('base64')
  const dataUri = `data:${file.mimetype};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'ecommerce/products',
  })

  return result.secure_url
}

const uploadImages = async (files = []) => {
  const urls = []
  for (const file of files) {
    const url = await uploadImage(file)
    urls.push(url)
  }
  return urls
}

module.exports = { uploadImages }
