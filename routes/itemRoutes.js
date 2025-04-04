import express from "express";

const router = express.Router();

// Example route for items
router.get("/", (req, res) => {
    res.send("Item routes are working!");
});

export default router;
