//importing modules
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');

// Connect and Create an Express Application
const app = express();
const port = 3000; // By default, its 3000, you can customize

// Create a Postgres Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FilaMintDB',
  password: 'hunter', // Change to your password
  port: 5432, // Default Port
});

app.use(express.static(path.join('')));

app.use(bodyParser.urlencoded({ extended: false }));

// Setup Route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Define the route for fetching customers by company name
app.get('/customers', async (req, res) => {
  const _company_name = req.query.company_name; // Extract the company name from the query parameter

  try {
    const query = 'SELECT * FROM public."tblCustomers" WHERE company_name = $1';
    const params = [_company_name];

    const result = await pool.query(query, params);
    res.json(result.rows); // Return the customer data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Listening to Requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

