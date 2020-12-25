import { expressSession } from 'next-session';
import connectMongo from 'connect-mongo';
import connectDB from './connectDB';

const prepareSessionOptions = async () => {
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
