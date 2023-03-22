const FRONTEND_URLS = {
  development: 'http://localhost:3000',
  staging: 'https://staging.zentaflowplan.com',
  production: 'https://zentaflowplan.com',
};

const API_URLS = {
  development: 'http://localhost:8080',
  staging: 'https://staging-api.zentaflowplan.com',
  production: 'https://api.zentaflowplan.com',
};

const SERVER_URL = API_URLS[process.env.NODE_ENV];
const FRONTEND_URL = FRONTEND_URLS[process.env.NODE_ENV];

const CORS_WHITELIST_LINKS = [
  'http://zentaflowplan.com',
  'https://zentaflowplan.com',
  'https://www.zentaflowplan.com',
];

if (process.env.NODE_ENV === 'staging') {
  CORS_WHITELIST_LINKS.push(
    ...['http://staging.zentaflowplan.com', 'https://staging.zentaflowplan.com']
  );
}

if (process.env.NODE_ENV === 'development') {
  CORS_WHITELIST_LINKS.push(...['http://localhost:3000']);
}

const DEFAULT_CURRENCY_UNIT = 'USD';

const DEFAULT_SCENARIOS = [
  { name: 'Main Account', active: true },
  { name: 'What If?' },
  { name: 'Budget' },
  { name: 'Available on Cash Credit' },
];

const DEFAULT_CATEGORIES = [
  'Income',
  'Property',
  'Transport',
  'Living Expenses',
  'Travel & Entertainment',
  'Family & Kids',
  'Business',
  'Miscellaneous',
  'Investments',
  'Savings & Loans',
];

module.exports = {
  SERVER_URL,
  FRONTEND_URL,
  CORS_WHITELIST_LINKS,
  DEFAULT_CURRENCY_UNIT,
  DEFAULT_SCENARIOS,
  DEFAULT_CATEGORIES,
};
