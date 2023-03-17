const mongoose = require('mongoose');

const logger = require('../utils/logger');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  const conn = await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  logger.log(`DB connection successful: ${conn.connection.host}`);
};

const disconnectDB = () => {
  mongoose.connection.close(() => {
    logger.log('Mongoose disconnected on app termination');
  });
};

module.exports = {
  connectDB,
  disconnectDB,
};
