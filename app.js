import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get('/', async (req, res) => {
    try {
        // Get total items count
        const itemsResult = await pool.query('SELECT COUNT(*) as total FROM items');
        const totalItems = parseInt(itemsResult.rows[0].total);

        // Get categories count
        const categoriesResult = await pool.query('SELECT COUNT(*) as total FROM categories');
        const totalCategories = parseInt(categoriesResult.rows[0].total);

        // Get total inventory value
        const valueResult = await pool.query('SELECT SUM(price * quantity) as total_value FROM items');
        const totalValue = parseFloat(valueResult.rows[0].total_value || 0);

        // Get recent items (last 5 added)
        const recentItems = await pool.query(`
            SELECT i.*, c.name as category_name 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id 
            ORDER BY i.id DESC 
            LIMIT 5
        `);

        res.render('homepage', {
            title: 'Inventory Management System',
            stats: {
                totalItems,
                totalCategories,
                totalValue: totalValue.toFixed(2),
                recentItems: recentItems.rows
            }
        });
    } catch (err) {
        console.error('Error loading homepage stats:', err);
        res.render('homepage', {
            title: 'Inventory Management System',
            stats: {
                totalItems: 0,
                totalCategories: 0,
                totalValue: '0.00',
                recentItems: []
            }
        });
    }
});

// Routes - mount category routes at /categories instead of /
app.use("/categories", categoryRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});