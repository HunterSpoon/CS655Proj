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

//set static file serving
app.use(express.static(path.join('')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup Route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Define the route for inserting a new customer
app.post('/customers/addNew', async (req, res) => {
  try {
    // Extract the parameters from the request
    const { firstName, lastName, companyName, shippingAddress } = req.body;
	
	// Check if the customer already exists
    const existingCustomerQuery = 'SELECT COUNT(*) FROM public."tblCustomers" WHERE first_name = $1 AND last_name = $2 AND company_name = $3 AND shipping_address = $4';
    const existingCustomerParams = [firstName, lastName, companyName, shippingAddress];
    const existingCustomerResult = await pool.query(existingCustomerQuery, existingCustomerParams);

    if (existingCustomerResult.rows[0].count > 0) {
      // Customer already exists
      return res.status(409).json({ error: 'Customer already exists.' });
    }
	
    // Execute the SQL query
    const query = 'INSERT INTO public."tblCustomers" (shipping_address, company_name, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const params = [shippingAddress, companyName, firstName, lastName]
	await pool.query(query, params);

    // Send a success response
    res.status(200).json({ message: 'Customer added successfully!' });
  } catch (error) {
    console.log('Error adding customer:', error);
    res.status(500).json({ error: 'An error occurred while adding the customer.' });
  }
});

//const { shippingAddress, companyName, firstName, lastName } = req.body;

// Define the route for fetching customers by company name
app.get('/customers/lookUpByCompany', async (req, res) => {
  const _companyName = req.query.companyName; // Extract the company name from the query parameter

  try {
    const query = 'SELECT * FROM public."tblCustomers" WHERE company_Name = $1';
    const params = [_companyName];

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

