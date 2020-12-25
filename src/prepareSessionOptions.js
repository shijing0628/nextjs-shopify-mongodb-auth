const prepareSessionOptions = async () => {
  const { expressSession } = require('next-session');
  const connectMongo = require('connect-mongo');
  const connectDB = require('./connectDB');
  const { mongooseConnection } = await connectDB();
  const MongoStore = connectMongo(expressSession);
  return {
    cookie: {
      maxAge: parseInt(process.env.SHOPIFY_APP_SESSION_COOKIE_MAXAGE, 10),
      secure: true,
      sameSite: 'None',
    },
    store: new MongoStore({ mongooseConnection }),
  };
};

export default prepareSessionOptions;
