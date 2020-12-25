const getShopify = require('./getShopify');
const {
  installMiddleware,
  redirectMiddleware,
  sessionMiddleware,
  urlMiddleware,
} = require('./middlewares');
const nextGetShopify = getShopify;
nextGetShopify.installMiddleware = installMiddleware;
nextGetShopify.redirectMiddleware = redirectMiddleware;
nextGetShopify.sessionMiddleware = sessionMiddleware;
nextGetShopify.urlMiddleware = urlMiddleware;
module.exports = nextGetShopify;
