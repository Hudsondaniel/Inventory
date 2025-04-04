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

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.stack);
        return;
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            console.error('❌ Error executing query:', err.stack);
            return;
        }
        console.log('✅ Database connected successfully at:', result.rows[0].now);
    });
});

// Add event listeners for pool errors
pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});

// Export pool for use in other modules
export default pool;