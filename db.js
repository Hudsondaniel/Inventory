import pkg from 'pg';
import fs from 'fs';
const { Pool } = pkg;

// Read and parse the JSON configuration file
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB_NAME,
    password: config.DB_PASSWORD,
    port: config.DB_PORT
});

// Export pool for use in other modules
export default pool;