var config = module.exports = {
  stripe_api_key: process.env.STRIPE_API_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  firebase_secret: process.env.FIREBASE_SECRET,
  firebase_root_url: process.env.FIREBASE_ROOT_URL || 'https://rocktriclub.firebaseio.com/',
  port: parseInt(process.env.PORT || 3000),

  email_from_address:   process.env.EMAIL_FROM_ADDRESS,
  email_gmail_user:     process.env.EMAIL_GMAIL_USER,
  email_gmail_password: process.env.EMAIL_GMAIL_PASSWORD,

  accessCode: process.env.ACCESS_CODE || undefined,
  google_analytics_tracker: process.env.GOOGLE_ANALYTICS_TRACKER || undefined
};

// set enableEmail if address and password are set
config.enable_email = !!(config.email_from_address
                      && config.email_gmail_user
                      && config.email_gmail_password);

if (config.accessCode) {
  // expect comma separated list
  config.accessCode = config.accessCode.split(',').map(function (it) { return it.trim(); });
}