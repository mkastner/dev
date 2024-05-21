/* eslint-disable no-undef */
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Create a PostgreSQL connection pool
// Create a .env file in /api/dev
// to use the database, you need to set the following environment variables:
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

//export the pool
export default pool;