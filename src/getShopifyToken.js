const getShopifyToken = (req, res) => {
  const {
    SHOPIFY_APP_CLIENT_SECRET: sharedSecret,
    SHOPIFY_APP_CLIENT_ID: apiKey,
    SHOPIFY_APP_REDIRECT_URI: redirectUri,
    SHOPIFY_APP_SCOPES: scopes,
    SHOPIFY_APP_GET_ACCESS_TOKEN_TIMEOUT: timeout,
    SHOPIFY_APP_ACCESS_MODE: accessMode,
  } = process.env;
  const ShopifyToken = require('shopify-token');
  const shopifyToken = new ShopifyToken({
    sharedSecret,
    apiKey,
    redirectUri: `https://${req.headers.host}${redirectUri}`,
    scopes,
    timeout: parseInt(timeout, 10),
    accessMode,
  });
  return shopifyToken;
};

module.exports = getShopifyToken;
