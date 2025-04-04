import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();
const PORT = 3030;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static("public")); // Ensure this middleware is present

app.use("/", categoryRoutes);
app.use("/items", itemRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});