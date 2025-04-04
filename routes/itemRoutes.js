// routes/itemRoutes.js
import express from "express";
import {
    getAllItems,
    getItemById,
    createItemForm,
    createItem,
    editItemForm,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js";

const router = express.Router();

// List all items
router.get("/", getAllItems);

// Show form to create a new item (for a specific category)
router.get("/new/:categoryId", createItemForm);

// Create a new item
router.post("/new/:categoryId", createItem);

// View a single item
router.get("/:id", getItemById);

// Show form to edit an item
router.get("/:id/edit", editItemForm);

// Update an item
router.post("/:id", updateItem);

// Delete an item
router.post("/:id/delete", deleteItem);

export default router;
