//importing modules
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");

//database schema
/*

CREATE TABLE IF NOT EXISTS public."tblCustomers"
(
    customer_id integer NOT NULL DEFAULT nextval('"Customers_customer_id_seq"'::regclass),
    shipping_address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    company_name character varying(255) COLLATE pg_catalog."default",
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Customers_pkey" PRIMARY KEY (customer_id)
)

CREATE TABLE IF NOT EXISTS public."tblInventory"
(
    inventory_id integer NOT NULL DEFAULT nextval('"tblInventory_inventory_id_seq"'::regclass),
    on_hand integer NOT NULL,
    last_restock date,
    material_id integer NOT NULL,
    CONSTRAINT "tblInventory_pkey" PRIMARY KEY (inventory_id),
    CONSTRAINT "tblInventory_material_id_key" UNIQUE (material_id),
    CONSTRAINT "tblInventory_material_id_fkey" FOREIGN KEY (material_id)
        REFERENCES public."tblMaterials" (material_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public."tblMaterials"
(
    material_id integer NOT NULL DEFAULT nextval('"tblMaterials_material_id_seq"'::regclass),
    material_type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    material_price numeric(10,2) NOT NULL,
    material_color character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "tblMaterials_pkey" PRIMARY KEY (material_id),
    CONSTRAINT "tblMaterials_material_type_material_color_key" UNIQUE (material_type, material_color)
)

CREATE TABLE IF NOT EXISTS public."tblOrder_Items"
(
    item_id integer NOT NULL DEFAULT nextval('"Order_Items_item_id_seq"'::regclass),
    order_id integer NOT NULL,
    quantity integer NOT NULL,
    material_id integer NOT NULL,
    CONSTRAINT "Order_Items_pkey" PRIMARY KEY (item_id),
    CONSTRAINT "tblOrder_Items_material_id_fkey" FOREIGN KEY (material_id)
        REFERENCES public."tblMaterials" (material_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "tblOrder_Items_order_id_fkey" FOREIGN KEY (order_id)
        REFERENCES public."tblOrders" (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public."tblOrders"
(
    order_id integer NOT NULL DEFAULT nextval('"tblOrders_order_id_seq"'::regclass),
    order_date date NOT NULL,
    order_tracking_info character varying(255) COLLATE pg_catalog."default",
    customer_id integer,
    CONSTRAINT "tblOrders_pkey" PRIMARY KEY (order_id),
    CONSTRAINT "tblOrders_customer_id_fkey" FOREIGN KEY (customer_id)
        REFERENCES public."tblCustomers" (customer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
*/



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

//set static file serving, body parser, and cors
app.use(express.static(path.join('')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors()); //used to allow cross-origin requests

// Setup Route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

//define the route for fetching all orders
app.get('/orders/All', async (req, res) => {
  try {
    const query = 'SELECT * FROM public."tblOrders" ORDER BY order_id ASC';
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /orders/All: ' + query);
    res.json(result.rows); // Return the order data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//define the route for fetching all orders, natural join with tblCustomers, and tblOrder_Items and tblMaterials
app.get('/orderItems/All', async (req, res) => {
  //this makes for a very large response payload, but oh well. The alternative is to make multiple requests, unless i'm just dense.
  try {
    const query = 'SELECT * FROM public."tblOrder_Items" Natural JOIN public."tblMaterials" ORDER BY "tblOrder_Items".order_id ASC';
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /orders/All/Verbose ' + query);
    res.json(result.rows); // Return the order data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Define the route for fetching all items in an order
app.get('/orderItems/AllItemsOnOrder', async (req, res) => {
  try {
    const orderID = req.query.order_ID; //get the order id from the query parameter
    const query = `SELECT * FROM public."tblOrder_Items" where order_id = '${orderID}' ORDER BY order_id ASC`;
    console.log(query);
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /orderItems/AllItemsOnOrder: ' + query);
    res.json(result.rows); // Return the order item data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//define the route for fetching all materials
app.get('/materials/All', async (req, res) => {
  try {
    const query = 'SELECT * FROM public."tblMaterials" ORDER BY material_id ASC';
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /materials/All: ' + query);
    res.json(result.rows); // Return the material data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for fetching orders by any combination of fields
app.post('/orders/lookUp', async (req, res) => {
  const {orderLookUpID, orderLookUpDate, orderLookUpTrackingInfo, orderLookUpCustomerID, orderLookUpCompany, orderLookUpAddr} = req.body;

  try {

    // Construct the query dynamically based on provided parameters
    let query = 'SELECT "tblOrders".order_id, "tblOrders".customer_id, "tblCustomers".shipping_address, "tblCustomers".company_name, "tblOrders".order_date, "tblOrders".order_tracking_info FROM public."tblOrders" NATURAL JOIN public."tblCustomers" WHERE 1=1'; // Start with a generic condition

    // Add conditions for non-empty parameters
    if (orderLookUpID) {
      query += ` AND order_id = '${orderLookUpID}'`;
    }

    if (orderLookUpDate) {
      query += ` AND order_date = '${orderLookUpDate}'`;
    }

    if (orderLookUpTrackingInfo) {
      query += ` AND order_tracking_info = '${orderLookUpTrackingInfo}'`;
    }

    if (orderLookUpCustomerID) {
      query += ` AND customer_id = '${orderLookUpCustomerID}'`;
    }

    if (orderLookUpCompany) {
      query += ` AND company_name = '${orderLookUpCompany}'`;
    }

    if (orderLookUpAddr) {
      query += ` AND shipping_address = '${orderLookUpAddr}'`;
    }

    // Execute the SQL query
    const result = await pool.query(query);
    // Log the query
    console.log('Query Made at: /orders/lookUp: ' + query);
    res.json(result.rows); // Return the order data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Define the route for fetching all customers
app.get('/customers/All', async (req, res) => {
  try {
    const query = 'SELECT * FROM public."tblCustomers" ORDER BY customer_id ASC';
    const result = await pool .query(query);
    //log the query
    console.log('Query Made at: /customers/All: ' + query);
    res.json(result.rows); // Return the customer data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    //log the query with the parameters
    console.log('Query Made at: /customers/addNew: ' + existingCustomerQuery + ' with parameters: ' + existingCustomerParams);

    if (existingCustomerResult.rows[0].count > 0) {
      // Customer already exists
      return res.status(409).json({ error: 'Customer already exists.' });
    }
	
    // Execute the SQL query
    const query = 'INSERT INTO public."tblCustomers" (shipping_address, company_name, first_name, last_name) VALUES ($1, $2, $3, $4)';
    const params = [shippingAddress, companyName, firstName, lastName]
	  await pool.query(query, params);
    //log the query with the parameters
    console.log('Query Made at: /customers/addNew: ' + query + ' with parameters: ' + params);

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

    // Execute the SQL query
    const result = await pool.query(query);
    // Log the query
    console.log('Query Made at: /customers/lookUp: ' + query);
    res.json(result.rows); // Return the customer data as JSON
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//define the route for deleting a customer via post request, delete from tblOrder_items first, then tblOrders, then tblCustomers
app.post('/customers/delete', async (req, res) => {
  //this might be bad practice, but this is just a school project
  const {customerID} = req.body;

  try {
    // Execute the SQL query
    const query = 'DELETE FROM public."tblOrder_Items" WHERE order_id IN (SELECT order_id FROM public."tblOrders" WHERE customer_id = $1); DELETE FROM public."tblOrders" WHERE customer_id = $1; DELETE FROM public."tblCustomers" WHERE customer_id = $1';
    const params = [customerID];
    await pool.query(query, params);
    //log the query with the parameters
    console.log('Query Made at: /customers/delete: ' + query + ' with parameters: ' + params);
    // Send a success response
    res.json({ message: 'Customer deleted successfully!' });
  } catch (error) {
    console.log('Error deleting customer:', error);
    res.status(500).json({ error: 'An error occurred while deleting the customer.' });
  }
});



app.post('/customers/Update', async (req, res) => {
  const {customerID, customerFirstName, customerLastName, customerCompanyName,customerShippingAddr} = req.body;

  try {

    // Construct the query dynamically based on provided parameters
    let query = 'UPDATE public."tblCustomers" SET ';

    // Add conditions for non-empty parameters
    if (customerFirstName) {
      query += `first_name = '${customerFirstName}',`;
    }

    if (customerLastName) {
      query += `last_name = '${customerLastName}',`;
    }
    
    if (customerCompanyName) {
      query += `company_name = '${customerCompanyName}',`;
    }
    
    if (customerShippingAddr) {
      query += `shipping_address = '${customerShippingAddr}',`;
    }

    // Remove the trailing comma
    query = query.slice(0, -1);

    query += ` WHERE customer_id = '${customerID}'`;

    
    // Execute the SQL query
    const result = await pool.query(query);
    //return the result
    res.json({ message: 'Customer updated successfully!' });
    // Log the query
    console.log('Update Query Made at: /customers/Update: ' + query);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Define the route for fetching the next customer
app.get('/customers/nextCustomer', async(req, res) => {
  const lookUpID  = req.query.lookUpID; //extract the lookUpId from the parameter
  
  try{
    const query = `SELECT customer_id FROM public."tblCustomers" WHERE customer_id > '${lookUpID}' ORDER BY customer_id LIMIT 1`;
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /customers/nextCustomer: ' + query);

    if (result.rows.length === 0) {
      // Handle the case where no customer ID is less than the specified lookUpID
      res.status(404).json({ error: 'No previous customer found.' });

    } else {
      const nextCustID = result.rows[0].customer_id;
      res.json({ nextCustID });
    }
  }catch(error){
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Define the route for fetching the previous customer
app.get('/customers/previousCustomer', async(req, res) => {
  const lookUpID  = req.query.lookUpID; //extract the lookUpId from the parameter
  
  try{
    const query = `SELECT customer_id FROM public."tblCustomers" WHERE customer_id < '${lookUpID}' ORDER BY customer_id DESC LIMIT 1`;    
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /customers/previousCustomer: ' + query);

    if (result.rows.length === 0) {
      // Handle the case where no customer ID is less than the specified lookUpID
      res.status(404).json({ error: 'No previous customer found.' });
    } else {
      const prevCustID = result.rows[0].customer_id;
      res.json({ prevCustID });
    }
  }catch(error){
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for fetching customers by company name
app.get('/customers/firstCustomer', async (req, res) => {
  

  try {
    const query = 'select min(customer_id) from public."tblCustomers"';
    const result = await pool.query(query);
    //log the query
    console.log('Query Made at: /customers/firstCustomer: ' + query);
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
    const query = 'SELECT * FROM public."tblCustomers" WHERE company_Name = `${_companyName}`';
    const result = await pool.query(query);
    // Log the query
    console.log('Query Made at: /customers/lookUpByCompany: ' + query);
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

