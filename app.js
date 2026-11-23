const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware to parse JSON request bodies.
app.use(express.json());

// Custom request logger middleware.
app.use(logger);

// Basic home route.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Student Management REST API",
    endpoints: [
      "GET /students",
      "GET /students/:id",
      "POST /students",
      "PUT /students/:id",
      "DELETE /students/:id"
    ]
  });
});

// Modular student routes.
app.use("/students", studentRoutes);

// Handle invalid JSON and other unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }

  console.error(err.stack || err);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
