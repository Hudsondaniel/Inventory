import express from 'express';
import {
    getCategories,
    getCategoryById,
    createCategoryForm,
    createCategory,
    editCategoryForm,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

// Home page: list all categories
router.get("/", getCategories);

// New category form
router.get("/new", createCategoryForm);

// Create a new category
router.post("/new", createCategory);

// View a single category and its items
router.get("/:id", getCategoryById);

// Edit category form
router.get("/:id/edit", editCategoryForm);

// Update a category
router.post("/:id", updateCategory);

// Delete a category
router.post("/:id/delete", deleteCategory);

export default router;
