module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://whatdo@localhost/whatdo',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'postgresql://whatdo@localhost/whatdo_test',
  JWT_SECRET: process.env.JWT_SECRET || 'whatdo-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
};
