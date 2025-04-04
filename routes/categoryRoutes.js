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
router.get("/categories/new", createCategoryForm);

// Create a new category
router.post("/categories", createCategory);

// View a single category and its items
router.get("/categories/:id", getCategoryById);

// Edit category form
router.get("/categories/:id/edit", editCategoryForm);

// Update a category
router.post("/categories/:id", updateCategory);

// Delete a category (you might add admin password check here)
router.post("/categories/:id/delete", deleteCategory);

export default router;
