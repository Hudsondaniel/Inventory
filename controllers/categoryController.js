import pool from "../db.js"; // Updated to include the `.js` extension

export const getCategories = async (req, res) => {
    try {
        // Get categories with item counts
        const result = await pool.query(`
            SELECT c.*, COUNT(i.id) as item_count 
            FROM categories c 
            LEFT JOIN items i ON c.id = i.category_id 
            GROUP BY c.id 
            ORDER BY c.name ASC
        `);
        res.render("index", { 
            title: "Categories", 
            categories: result.rows 
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to fetch categories. Please try again later.'
        });
    }
};

export const createCategoryForm = async (req, res) => {
    res.render("new-category", { 
        title: "New Category"
    });
};

// Create a new category
export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
            [name, description]
        );
        res.redirect("/categories");
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to create category. Please try again later.'
        });
    }
};

// Get a category by ID and list its items
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate that id is a number
        if (isNaN(id)) {
            return res.status(400).render('error', {
                title: 'Invalid Request',
                message: 'Invalid category ID provided'
            });
        }

        // Get category and its items
        const categoryResult = await pool.query(`
            SELECT c.*, COUNT(i.id) as item_count 
            FROM categories c 
            LEFT JOIN items i ON c.id = i.category_id 
            WHERE c.id = $1 
            GROUP BY c.id
        `, [id]);

        if (categoryResult.rows.length === 0) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Category not found'
            });
        }

        // Get items in this category
        const itemsResult = await pool.query(`
            SELECT * FROM items 
            WHERE category_id = $1 
            ORDER BY name ASC
        `, [id]);

        res.render("category", {
            title: categoryResult.rows[0].name,
            category: categoryResult.rows[0],
            items: itemsResult.rows
        });
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to fetch category details. Please try again later.'
        });
    }
};

// Show form to edit a category
export const editCategoryForm = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate that id is a number
        if (isNaN(id)) {
            return res.status(400).render('error', {
                title: 'Invalid Request',
                message: 'Invalid category ID provided'
            });
        }

        const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Category not found'
            });
        }

        res.render("edit-category", { 
            title: "Edit Category", 
            category: result.rows[0] 
        });
    } catch (err) {
        console.error('Error loading edit form:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load the edit form. Please try again later.'
        });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        // Validate that id is a number
        if (isNaN(id)) {
            return res.status(400).render('error', {
                title: 'Invalid Request',
                message: 'Invalid category ID provided'
            });
        }

        const result = await pool.query(
            "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
            [name, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Category not found'
            });
        }

        res.redirect(`/categories/${id}`);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to update category. Please try again later.'
        });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate that id is a number
        if (isNaN(id)) {
            return res.status(400).render('error', {
                title: 'Invalid Request',
                message: 'Invalid category ID provided'
            });
        }

        const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).render('error', {
                title: 'Not Found',
                message: 'Category not found'
            });
        }

        res.redirect("/categories");
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to delete category. Please try again later.'
        });
    }
};