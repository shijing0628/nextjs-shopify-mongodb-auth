const { applySession } = require('next-session');
const prepareSessionOptions = require('./prepareSessionOptions');
const Shopify = require('shopify-api-node');

const getShopify = async (ctx) => {
  const { req, res, resolvedUrl } = ctx;
  const options = await prepareSessionOptions();
  await applySession(req, res, options);
  const { shopName, accessToken } = req.session;
  if (!shopName || !accessToken) {
    res
      .writeHead(302, {
        Location: `/api/shopify/install${resolvedUrl.replace('/', '')}`,
      })
      .end();
    return false;
  }

  const shopify = new Shopify({
    shopName,
    apiVersion: process.env.SHOPIFY_APP_API_VERSION,
    autoLimit: JSON.parse(process.env.SHOPIFY_APP_AUTO_LIMIT),
    presentmentPrices: JSON.parse(process.env.SHOPIFY_APP_PRESENTMENT_PRICES),
    timeout: parseInt(process.env.SHOPIFY_APP_API_REQUEST_TIMEOUT, 10),
    accessToken,
  });

  let accessScope;
  try {
    accessScope =
      shopify &&
      shopify.accessScope &&
      typeof shopify.accessScope.list === 'function' &&
      (await shopify.accessScope.list());
  } catch (err) {
    res
      .writeHead(302, {
        Location: `/api/shopify/install${resolvedUrl.replace('/', '')}`,
      })
      .end();
    return false;
  }

  if (!accessScope) {
    res
      .writeHead(302, {
        Location: `/api/shopify/install${resolvedUrl.replace('/', '')}`,
      })
      .end();
    return false;
  }
  return shopify;
};

module.exports = getShopify;
