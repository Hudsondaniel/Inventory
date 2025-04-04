// controllers/itemController.js
import pool from "../db.js";

// Get all items with their categories
export const getAllItems = async (req, res) => {
    try {
        // Get all items with their category names
        const itemsResult = await pool.query(`
            SELECT i.*, c.name as category_name 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id 
            ORDER BY i.name ASC
        `);
        
        // Get all categories for the filter dropdown
        const categoriesResult = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        
        res.render("items", { 
            title: "All Items", 
            items: itemsResult.rows,
            categories: categoriesResult.rows
        });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to fetch items. Please try again later.'
        });
    }
};

// View a single item
export const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT i.*, c.name as category_name 
            FROM items i 
            LEFT JOIN categories c ON i.category_id = c.id 
            WHERE i.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Item not found'
            });
        }
        
        res.render("item", {
            title: result.rows[0].name,
            item: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching item:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to fetch item details. Please try again later.'
        });
    }
};

// Show form to create a new item in a category
export const createItemForm = async (req, res) => {
    try {
        // Get the categoryId from query parameter
        const { categoryId } = req.query;
        const categories = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        
        res.render("new-item", { 
            title: "New Item", 
            categoryId: categoryId || '',
            categories: categories.rows
        });
    } catch (err) {
        console.error('Error loading new item form:', err);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Unable to load the new item form. Please try again later.' 
        });
    }
};

// Create a new item
export const createItem = async (req, res) => {
    const { name, description, price, quantity, categoryId } = req.body;
    
    try {
        const result = await pool.query(
            "INSERT INTO items (name, description, price, quantity, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, quantity, categoryId]
        );
        
        // Redirect back to the category page if we have a category ID
        if (categoryId) {
            res.redirect(`/categories/${categoryId}`);
        } else {
            res.redirect('/items');
        }
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Unable to create item. Please try again later.' 
        });
    }
};

// Show form to edit an item
export const editItemForm = async (req, res) => {
    const { id } = req.params;
    try {
        const itemResult = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
        if (itemResult.rows.length === 0) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Item not found' 
            });
        }
        
        const categories = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.render("edit-item", { 
            title: "Edit Item", 
            item: itemResult.rows[0],
            categories: categories.rows
        });
    } catch (err) {
        console.error('Error loading edit form:', err);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Unable to load the edit form. Please try again later.' 
        });
    }
};

// Update an item
export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity, category_id } = req.body;
    try {
        const result = await pool.query(
            "UPDATE items SET name=$1, description=$2, price=$3, quantity=$4, category_id=$5 WHERE id=$6 RETURNING *",
            [name, description, price, quantity, category_id, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Item not found' 
            });
        }
        
        res.redirect(`/items/${id}`);
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Unable to update item. Please try again later.' 
        });
    }
};

// Delete an item
export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM items WHERE id=$1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', { 
                title: 'Not Found',
                message: 'Item not found' 
            });
        }
        
        res.redirect("/items");
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).render('error', { 
            title: 'Error',
            message: 'Unable to delete item. Please try again later.' 
        });
    }
};
