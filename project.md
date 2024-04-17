# Project 1: A CRUD Application
Project Name: filaMint\
Group Members: Hunter Spoon\
[GitHub: HunterSpoon](https://github.com/HunterSpoon)\
[Project Repo](https://github.com/HunterSpoon/CS655Proj)

## Project Video
[Project Video](https://youtu.be/YpMEi6VRR54)

## Database Schema
Database Software: PostgreSQL\
Tables: 
|Table Name| Table Fields | Table Purpose|
|----------|--------------|--------------|
|tblCustomers| customer_id, shipping_address, company_name, first_name, last_name| Holds information about customers|
|tblInventory| inventory_id, on_hand, last_restock, material_id| Holds information about materials in warehouse|
|tblMaterials| material_id, material_type, material_price, material_color| Holds information about materials available for sale|
|tblOrder_Items| item_id, order_id, quantity, material_id | Holds information about the items on an order|
|tblOrders|order_id, order_date, order_tracking_info, customer_id| Holds information about orders placed by customers|

## Technologies Used
[Database Software: PostgreSQL](https://www.postgresql.org/)\
[Backend: Node.js](https://nodejs.org/)\
[Middleware: Express.js](https://expressjs.com/)

## Project Commits
[Link to Commits](https://github.com/HunterSpoon/CS655Proj/commits/main/)\
Commits are listed from least to most recent
|Commit Number| Commit Name | Commit Description | Commit Date | Change Numbers |
|-------------|-------------|--------------------|-------------|----------------|
|1|Setup|Setting up the enviroment|4/8/2024| +168 -0|
|2|Setup Cont.| Getting Closer to correctly setting up the express.js server and client.js|4/8/2024|+63 -123|
|3|Setup Complete| backend.js - runs server using express.js as middle ware, pg as sql server, pody-parser for http request parsing. client.js - client side js file, currently only supports looking up customers by company name index.html - html GUI for client.js|4/8/2024|+35 -24|
|4|Can add customer to db now. First post request!| user can now make add new customers to the database|4/9/2024| +144 -14|
|5|Incremental Update|Created HTML skeleton for the whole app. Created customerBrowser.html that is a form that lets user view and update customer records. Plan for similar form for each DB table. Created customerList.html which will contain table of all records for customers table. Plan for similar file for each DB table.|4/11/2024|+133 -28|
|6|Uploading DB Structure|Adding files describing the DB structure so I can work on this elsewhere|4/11/2024|+67 -0|
|7|Completed HTML layout for app and forms.|Filled in HTML skeleton with completed HTML|4/11/2024|+270 -5|
|8|Iterative Development|Finished work on the customer look up functionality that allows user to look up customers in the database, started work on customer browser to edit and delete records|4/11/2024|+249 -18|
|9|Iterative Development| Added functionality for Next/Previous/Update in the customer browser.| 4/12/2024| +236 -12|
|10|Customer Center Complete| Completed the Customer Center: hub for all CRUD operations relating mainly to the tblCustomers table. Development should pick up now that I've got this figured out. | 4/14/2024 | +312 -46|
|11|Replaced appendElementToElement with DisplaJsonInTable| Modifying function | 4/14/2024 | +124 -32|
|12|Iterative Development | Finished work on orderBrowser: allows user to view complete list of orders, and the items on them. I hate weak entities.|4/15/2024 |+266 -18|
|13|Iterative Development | Completed MaterialAdd function in the material center that allows the user to add a new material to the database |4/15/2024 |+174 -58|
|14|Iterative Development | Material Look up complete. |4/15/2024 |+124 -7|
|15|Iterative Development |Finished the Materials Browser. Way for users to browse, update, and delete records from the materials table. Also includes a information from the inventory table that corresponds to materials.|4/15/2024 |+379 -9|
|15|Iterative Development |Completed materialList. Way for user to view all materials and their associated inventory records as a list.|4/15/2024 |+98 -1|
|16|Iterative Development |Create/Update Inventory is complete.|4/15/2024 |+416 -198|
|17|Functionality Complete |All CRUD functionalities for all tables are complete.|4/15/2024 |+792 -48|
|18|Iterative CSS Formatting |Working on formatting the CSS|4/16/2024 |+75 -13|





