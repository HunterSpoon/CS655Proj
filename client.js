// client.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

function domLoaded() {
	//add event listeners to buttons
	//customer Center
		//add customer button
		document.getElementById("addNewCustomer").addEventListener("click", CustomerAdd);
		//lookup customer button
		document.getElementById("CustomerlookUp").addEventListener("click", CustomerLookup);

	//order Center
		//lookup order button
		document.getElementById("orderLookUpButton").addEventListener("click", OrderLookup);

	//material Center
		//add material button
		document.getElementById("addNewMaterial").addEventListener("click", MaterialAdd);
}


//function that adds a new material to the database via post request to /materials/addNew
async function MaterialAdd(){
	//getting the input values
	const inputs = ["materialsType", "materialsPrice", "materialsColor"];
	const allFilled = inputs.every(id => document.getElementById(id).value.trim() !== "");

	//div to display the material data
	const createNewMaterialDiv = document.getElementById('createNewMaterialDiv');
	createNewMaterialDiv.innerHTML = '';

	if(allFilled){
		createNewMaterialDiv.innerHTML = 'working';
		try{
			// Create a new material object
			const materialData = {
				materialType: document.getElementById("materialsType").value.trim(),
				materialPrice: document.getElementById("materialsPrice").value.trim(),
				materialColor: document.getElementById("materialsColor").value.trim()
			}

			// Send a POST request to the server
			const response = await fetch(`${serverUrl}/materials/addNew`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(materialData)
			});

			
			//handle responses
			if (response.ok) { //response is ok
				console.log('Material added successfully!');
				createNewMaterialDiv.innerHTML = 'Material Added';
				createNewMaterialDiv.style.color = 'green';
			} else if (response.status === 409) { //material already exists
				createNewMaterialDiv.innerHTML = '!: Material Already Exists';
				createNewMaterialDiv.style.color = 'red';
			} else { //other errors
				throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
			}

		} catch (error) {
			// Handle error response
			console.error('Error adding material:', error);
			createNewMaterialDiv.innerHTML = 'Error adding material';
			createNewMaterialDiv.style.color = 'red';
		}
	}
	else {
		createNewMaterialDiv.innerHTML = '!: All Fields Must Be Filled';
		createNewMaterialDiv.style.color = 'red';
	}
}

//function that fetches all orders from database via get request to /orders/All
async function OrderLookup(){
	//getting the input values
	const inputs =["orderLookUpID", "orderLookUpDate", "orderLookUpTrackingInfo", "orderLookUpCustomerID", "orderLookUpCompany", "orderLookUpAddr"]
	const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");
	 
	//div to display the order data
	const orderLookUpDiv = document.getElementById("orderLookUpDiv");
	orderLookUpDiv.innerHTML ='';
	orderLookUpDiv.style.Color ='';

	if (atLeastOneFilled){
		orderLookUpDiv.innerHTML='working';
		try{
			const orderData ={
				orderLookUpID: document.getElementById("orderLookUpID").value.trim(),
				orderLookUpDate: document.getElementById("orderLookUpDate").value.trim(),
				orderLookUpTrackingInfo: document.getElementById("orderLookUpTrackingInfo").value.trim(),
				orderLookUpCustomerID: document.getElementById("orderLookUpCustomerID").value.trim(),
				orderLookUpCompany: document.getElementById("orderLookUpCompany").value.trim(),
				orderLookUpAddr: document.getElementById("orderLookUpAddr").value.trim()
			}

			const response = await fetch(`${serverUrl}/orders/LookUp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(orderData)
			});

			//handle responses
			if (!response.ok) { //response is not ok
				throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
			} else { //response is ok
				const data = await response.json();
				orderLookUpDiv.innerHTML = '';
				orderLookUpDiv.style.Color = '';

				//check if data is not empty
				const isNotEmpty = !!data && Object.keys(data).length;
				if (isNotEmpty) {
					displayJsonInTable(data, "orderLookUpDiv");
				} else {
					orderLookUpDiv.style.Color = '';
					orderLookUpDiv.innerHTML = '!: No Orders Match'
				}
			}

		}catch (error){
			console.error('Error looking up order:', error);
			orderLookUpDiv.innerHTML='!: Error looking up order';
			orderLookUpDiv.style.color="red";
		}
	}else{
		orderLookUpDiv.innerHTML='!: At Least One Field Must Be Filled';
		orderLookUpDiv.style.color="red";
	};
};


//function that displays json data in a table in target div
async function displayJsonInTable(jsonData, targetDiv){
	const target = document.getElementById(targetDiv);
	target.innerHTML = '';
	
	if (jsonData.length === 0){
		target.innerHTML = 'Error: No data found.';
		return;
	}
	
	const table = document.createElement('table');
	const header = table.createTHead();
	const headerRow = header.insertRow(0);
	
	//adding headers
	const headers = Object.keys(jsonData[0]);
	
	for (const header of headers){
		const cell = headerRow.insertCell();
		cell.textContent = header;
	}
	
	//adding data
	const body = table.createTBody();
	for (const obj of jsonData){
		const row = body.insertRow();
		for (const header of headers){
			const cell = row.insertCell();
			cell.textContent = obj[header];
		}
	}

	//removing the underscores from the headers in the table and making them Title case
	const headerCells = headerRow.cells;
	for (const cell of headerCells){
		const header = cell.textContent;
		const titleCaseHeader = header.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
		cell.textContent = titleCaseHeader;
	}
	
	//appending the table to the target div
	target.appendChild(table);
}

//function that fetches all customers from database via post request to /customers/All
async function CustomerLookup(){
	const inputs =["lookUpID", "lookUpFirstName",  "lookUpLastName",  "lookUpCompany", "lookUpAddr"]
	const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");
	const lookUpCustomerDiv = document.getElementById("lookUpCustomerDiv"); //div to display the customer data

	lookUpCustomerDiv.innerHTML ='';
	lookUpCustomerDiv.style.Color ='';

	if (atLeastOneFilled){
		lookUpCustomerDiv.innerHTML='working';

		try{
			const customerData ={
				lookUpID: document.getElementById("lookUpID").value.trim(),
				lookUpFirstName: document.getElementById("lookUpFirstName").value.trim(),
				lookUpLastName: document.getElementById("lookUpLastName").value.trim(),
				lookUpCompany: document.getElementById("lookUpCompany").value.trim(),
				lookUpAddr: document.getElementById("lookUpAddr").value.trim()
			}

			const response = await fetch(`${serverUrl}/customers/lookUp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

			const data = await response.json();
			lookUpCustomerDiv.innerHTML ='';
			lookUpCustomerDiv.style.Color ='';

			const isNotEmpty = !!data && Object.keys(data).length;
			if (isNotEmpty){
				displayJsonInTable(data, "lookUpCustomerDiv");
			}else{
				lookUpCustomerDiv.style.Color ='';
				lookUpCustomerDiv.innerHTML = '!: No Customers Match'
			}
			

		}catch (error){
			console.error('Error looking up customer:', error);
			lookUpCustomerDiv.innerHTML='!: Error looking up customer';
			lookUpCustomerDiv.style.color="red";
		}
	}else{
		lookUpCustomerDiv.innerHTML='!: At Least One Field Must Be Filled';
		lookUpCustomerDiv.style.color="red";
	}
};

//function that adds a new customer to the database via post request to /customers/addNew
async function CustomerAdd(){
	const inputs = ["customerFirstName", "customerLastName", "customerCompanyName", "customerShippingAddr"];
    const allFilled = inputs.every(id => document.getElementById(id).value.trim() !== "");
	const createCustomerMessageFieldDiv = document.getElementById('createCustomerUpdateMessage');
	createCustomerMessageFieldDiv.innerHTML = '';
	createCustomerMessageFieldDiv.style.color = '';
	
	if(allFilled){
		try {
			const customerData = {
				firstName: document.getElementById("customerFirstName").value.trim(),
				lastName: document.getElementById("customerLastName").value.trim(),
				companyName: document.getElementById("customerCompanyName").value.trim(),
				shippingAddress: document.getElementById("customerShippingAddr").value.trim()
			}

            const response = await fetch(`${serverUrl}/customers/addNew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }

            // Handle success response here
            console.log('Customer added successfully!');
			createCustomerMessageFieldDiv.innerHTML = '!: Customer Added';
			createCustomerMessageFieldDiv.style.color = 'green';
        } catch (error) {
            console.error('Error adding customer:', error);
			createCustomerMessageFieldDiv.innerHTML = '!: 409-Customer Already Exists';
			createCustomerMessageFieldDiv.style.color = 'red';
        }
    } else {
		console.log("At least one variable is empty or null.")
	}
}

// Function to fetch customer data and update the div
async function fetchCustomers() {
	const companyName = document.getElementById("CompanyInput").value;
	
	if(companyName != ""){
		try {
			const response = await fetch(`${serverUrl}/customers/lookUpByCompany?companyName=${encodeURIComponent(companyName)}`);
			if (!response.ok) {
				throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
			displayCustomers(data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
}

// Function to append generic data to a generic element
function appendDataToElement(data, elementId) {
    // Get the element by its ID
    const targetElement = document.getElementById(elementId);

    if (!targetElement) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    // Append the data to the element
    targetElement.innerHTML += `${data}<br>`;
}

// Function to display customer data in the div
function displayCustomers(customers) {
    const customersDiv = document.getElementById('customers_list');
    customersDiv.innerHTML = ''; // Clear existing content

    if (customers.length === 0) {
        customersDiv.textContent = 'No customers found.';
        return;
    }

    const ul = document.createElement('ul');
    customers.forEach((customer) => {
        const li = document.createElement('li');
        li.textContent = `${customer.first_name} ${customer.last_name}`;
        ul.appendChild(li);
    });

    customersDiv.appendChild(ul);
}

