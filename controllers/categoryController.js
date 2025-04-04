import pool from "../db.js"; // Updated to include the `.js` extension

export const getCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY id");
        res.render("index", { title: "Categories", categories: result.rows });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const createCategoryForm = async (req, res) => {
    res.render("new-category", { title: "New Category" });
}

// Create a new category
export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [
            name,
            description,
        ]);
        res.redirect("/");
        } catch (err) {
        res.status(500).send(err.message);
        }
    };


// Get a category by ID and list its items
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
    const categoryResult = await pool.query("SELECT * FROM categories WHERE id=$1", [id]);
    const itemsResult = await pool.query("SELECT * FROM items WHERE category_id=$1", [id]);
    if (categoryResult.rows.length === 0) {
        return res.status(404).send("Category not found");
    }
    res.render("category", {
        title: categoryResult.rows[0].name,
        category: categoryResult.rows[0],
        items: itemsResult.rows,
    });
    } catch (err) {
    res.status(500).send(err.message);
    }
};

// Show form to edit a category
export const editCategoryForm = async (req, res) => {
    const { id } = req.params;
    try {
    const result = await pool.query("SELECT * FROM categories WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Category not found");
    res.render("edit-category", { title: "Edit Category", category: result.rows[0] });
    } catch (err) {
    res.status(500).send(err.message);
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
    await pool.query("UPDATE categories SET name=$1, description=$2 WHERE id=$3", [
        name,
        description,
        id,
    ]);
    res.redirect(`/categories/${id}`);
    } catch (err) {
    res.status(500).send(err.message);
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    // Optionally, check for an admin password in req.body before deleting.
    try {
    await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    res.redirect("/");
    } catch (err) {
    res.status(500).send(err.message);
    }
};