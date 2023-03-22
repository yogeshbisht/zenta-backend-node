const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment');
const compression = require('compression');
const apicache = require('apicache-plus');

apicache.options({
  headerBlacklist: ['access-control-allow-origin'],
  debug: process.env.NODE_ENV === 'development',
});

const { CORS_WHITELIST_LINKS } = require('./constants');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  req.requestTime = moment().format();
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || CORS_WHITELIST_LINKS.indexOf(origin) > -1) {
      callback(null, true);
    }
  },
};
app.use(cors(corsOptions));

app.use(compression());

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/scenario', require('./routes/scenario'));

module.exports = app;
