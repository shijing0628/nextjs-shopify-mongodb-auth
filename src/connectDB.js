const mongoose = require('mongoose');

const connection = {};

async function connectDB() {
  if (connection.isConnected && connection.mongooseConnection) {
    return connection;
  }

  const db = await mongoose.connect(process.env.SHOPIFY_APP_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.isConnected = db.connections[0].readyState;
  connection.mongooseConnection = mongoose.connection;
  return connection;
}

module.exports = connectDB;
