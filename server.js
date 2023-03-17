const dotenv = require('dotenv');
const http = require('http');

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const { connectDB, disconnectDB } = require('./config/db');
const logger = require('./utils/logger');
const app = require('./app');

let ONLINE = true;

app.get('./health-check', (req, res) => {
  if (ONLINE) {
    return res.send('OK');
  }

  res.status(503).send('Server shutting down');
});

app.use((req, res, next) => {
  if (req.path === '/') {
    return res.status(200).json({
      organization: 'zentaflowplan.com',
      type: 'api',
    });
  }

  res.status(403).json({
    message: 'access denied',
  });
});

const server = http.createServer(app);

connectDB();

const mode = process.env.NODE_ENV;
const port = process.env.PORT || 8080;

server.listen(port, () => {
  logger.log(`Server running in ${mode} mode on port ${port}...`);
});

const gracefulShutdownHandler = (signal) => {
  logger.log(`⚠️ Caught ${signal}, gracefully shutting down`);
  ONLINE = false;

  logger.log('🤞 Shutting down application');
  // stop the server from accepting new connections
  disconnectDB();

  server.close(() => {
    logger.log('👋 All requests stopped, shutting down');
    // once the server is not accepting connections, exit
    process.exit();
  });
};

process.on('unhandledRejection', (err) => {
  logger.log('UNHANDLED REJECTION');
  logger.error(err);
});

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on('SIGINT', gracefulShutdownHandler);

// The SIGTERM signal is sent to a process to request its termination.
process.on('SIGTERM', gracefulShutdownHandler);
