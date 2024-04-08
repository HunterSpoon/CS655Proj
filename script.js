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

// Route handler for GET student data
app.get('/materials', (req, res) => {
  const query = 'SELECT * FROM public."tblMaterials";';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const materials = result.rows;
      res.json(materials);
    }
  });
});

app.get('/inventory', (req, res) => {
  const query = 'SELECT * FROM public."tblInventory";';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const materials = result.rows;
      res.json(materials);
    }
  });
});

app.get('/customers', (req, res) => {
  const query = 'SELECT * FROM public."tblCustomers";';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error occurred:', error);
      res.status(500).send('An error occurred while retrieving data from the database.');
    } else {
      const materials = result.rows;
      res.json(materials);
    }
  });
});

async function getCustomersByCompanyName(_company_name){
	const query = 'Select * from public."tblCustomers" where company_name = $1';
	const params = [_company_name];
	
	try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Example usage:
const _company_name = 'NexTech';
getCustomersByCompanyName(_company_name)
	.then((tblCustomers) => {
    console.log('Customers:', tblCustomers);
  })
  .catch((err) => {
    console.error('Error fetching customers:', err);
  });

// Listening to Requests
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

