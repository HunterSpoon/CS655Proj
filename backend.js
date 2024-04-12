//importing modules
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");


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
app.use(cors());

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

// Define the route for fetching customers by any combination of fields
app.post('/customers/lookUp', async (req, res) => {
  const {lookUpID, lookUpFirstName,  lookUpLastName,  lookUpCompany, lookUpAddr} = req.body;

  try {

    // Construct the query dynamically based on provided parameters
    let query = 'SELECT * FROM public."tblCustomers" WHERE 1=1'; // Start with a generic condition

    // Add conditions for non-empty parameters
    if (lookUpID && lookUpID.trim != "" && lookUpID !== null) {
      query += ` AND customer_id = '${lookUpID}'`;
    }

    if (lookUpFirstName) {
      query += ` AND first_name = '${lookUpFirstName}'`;
    }

    if (lookUpLastName) {
      query += ` AND last_name = '${lookUpLastName}'`;
    }
    
    if (lookUpCompany) {
      query += ` AND company_name = '${lookUpCompany}'`;
    }
    
    if (lookUpAddr) {
      query += ` AND shipping_address = '${lookUpAddr}'`;
    }

    console.log('Query Made at: /customers/lookUp: ' + query);

    //const query = 'SELECT * FROM public."tblCustomers" WHERE customer_id = $1 and first_name = $2 and last_name = $3 and company_name = $4 and shipping_address = $5';
    //const params = [lookUpID, lookUpFirstName,  lookUpLastName,  lookUpCompany, lookUpAddr]

    const result = await pool.query(query);
    res.json(result.rows); // Return the customer data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for fetching customers by company name
app.get('/customers/firstCustomer', async (req, res) => {
  

  try {
    const query = 'select min(customer_id) from public."tblCustomers"';

    const result = await pool.query(query);
    const minCustomerId = result.rows[0].min; // Access the 'min' property
    res.json({ minCustomerId });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

