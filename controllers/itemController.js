// controllers/itemController.js
import pool from "../db.js";

// View a single item
export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Item not found");
    res.render("item", { title: result.rows[0].name, item: result.rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Show form to create a new item in a category
export const createItemForm = async (req, res) => {
  const { categoryId } = req.params;
  res.render("new-item", { title: "New Item", categoryId });
};

// Create a new item
export const createItem = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, price, quantity } = req.body;
  try {
    await pool.query(
      "INSERT INTO items (name, description, price, quantity, category_id) VALUES ($1, $2, $3, $4, $5)",
      [name, description, price, quantity, categoryId]
    );
    res.redirect(`/categories/${categoryId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Show form to edit an item
export const editItemForm = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Item not found");
    res.render("edit-item", { title: "Edit Item", item: result.rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Update an item
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  try {
    await pool.query(
      "UPDATE items SET name=$1, description=$2, price=$3, quantity=$4, category_id=$5 WHERE id=$6",
      [name, description, price, quantity, category_id, id]
    );
    res.redirect(`/items/${id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete an item
export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    // Optionally add an admin password check before deletion.
    await pool.query("DELETE FROM items WHERE id=$1", [id]);
    res.redirect("back"); // Redirect back to the referring page
  } catch (err) {
    res.status(500).send(err.message);
  }
};
