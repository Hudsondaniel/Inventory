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

// Function to test the connection
async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()'); // Simple query to get the current time
        console.log('Database connected successfully:', res.rows[0]);
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    } finally {
        await pool.end(); // Close the connection pool
    }
}

// Call the test function
testConnection();

export default pool;