const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js API' });
});

// Sample API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
