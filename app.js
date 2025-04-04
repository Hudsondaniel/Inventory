import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js"; // Added import for itemRoutes

const app = express();
const PORT = 3030;

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static("public"));

// Mount routes
app.use("/", categoryRoutes);  // Home page could show categories
app.use("/items", itemRoutes);   // Item-specific routes

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});