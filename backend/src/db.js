const { Pool } = require('pg');

const pool = new Pool({
  user: 'sudipta',
  host: 'dev-pgsql-1.cdmitf0y2qoi.us-east-1.rds.amazonaws.com',
  database: 'sudipta',
  password: 'Sudipta@123',
  port: 5432,
});

module.exports = pool;

