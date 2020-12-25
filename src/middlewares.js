import axios from 'axios';
import { applySession } from 'next-session';
import prepareSessionOptions from './prepareSessionOptions';
import getShopifyToken from './getShopifyToken';
import { removeProperties } from './helpers';

export const sessionMiddleware = async (req, res, next) => {
  const options = await prepareSessionOptions();
  await applySession(req, res, options);
  next();
};

export const installMiddleware = async (req, res, next) => {
  if (req.query.fn === 'install') {
    const { shop } = req.query;
    if (!shop || !shop.includes('.myshopify.com')) {
      res.writeHead(400).end('Login your shopify account first, please!');
    }
    const shopName = shop.replace('.myshopify.com', '');
    const shopifyToken = getShopifyToken(req, res);
    const query = removeProperties(req.query, ['fn']);
    if (!shopifyToken.verifyHmac(query)) {
      res.writeHead(400).end('getAuthUrl: HMAC validation failed!');
    }

    const nonce = shopifyToken.generateNonce();
    req.session.nonce = nonce;
    const authUrl = shopifyToken.generateAuthUrl(
      shopName,
      process.env.SHOPIFY_APP_SCOPES,
      nonce
    );
    req.redirectUrl = authUrl;
    next();
  } else {
    next();
  }
};

export const redirectMiddleware = async (req, res, next) => {
  if (req.query.fn === 'redirect') {
    const { code, hmac, shop, state } = req.query;
    const nonce = req.session.nonce;
    if (state !== nonce) {
      res.writeHead(400).end(`NONCE validation failed!`);
    }

    if (shop.match(/[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com[\/]?/) === null) {
      res.writeHead(400).end('HOSTNAME validation failed!');
    }

    const shopifyToken = getShopifyToken(req, res);
    const query = removeProperties(req.query, ['fn']);
    if (!shopifyToken.verifyHmac(query)) {
      res.writeHead(400).end('HMAC validation failed!');
    }

    const shopName = shop.replace('.myshopify.com', '');
    req.session.shopName = shopName;

    const accessTokenRelatedInfo = await shopifyToken.getAccessToken(
      shop,
      code
    );
    if (!accessTokenRelatedInfo || !accessTokenRelatedInfo.access_token) {
      res.writeHead(400).end('CODE validation failed!');
    }
    req.session.accessToken = accessTokenRelatedInfo.access_token;
    req.redirectUrl = `https://${shop}/admin/apps/${process.env.SHOPIFY_APP_SLUG}`;
    next();
  } else {
    next();
  }
};

export const urlMiddleware = async (req, res, next) => {
  if (
    !req.redirectUrl ||
    (req.query.fn !== 'install' && req.query.fn !== 'redirect')
  ) {
    res.writeHead(404).end('Route API not found');
  }
  next();
};
