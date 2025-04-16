const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

// Create the Express app
const app = express();
const port = process.env.PORT || 8082;  // Update the port to 8082

// Middleware
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Test the PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

// Routes
const ordersRoute = require('./routes/orders'); // Ensure the correct path and file name
app.use('/orders', ordersRoute);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
