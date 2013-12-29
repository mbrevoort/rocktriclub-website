module.exports = {
  stripe_api_key: process.env.STRIPE_API_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  firebase_secret: process.env.FIREBASE_SECRET,
  firebase_root_url: process.env.FIREBASE_ROOT_URL || 'https://rocktriclub.firebaseio.com/',
  port: parseInt(process.env.PORT || 3000),
}