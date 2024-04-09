// client.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

function domLoaded() {
	//document.addEventListener('DOMContentLoaded', fetchCustomers);
	
	let btnLookUp = document.getElementById("CompanyInputButton");
	btnLookUp.addEventListener("click", fetchCustomers);
	
	let addCustomer = document.getElementById("addNewCustomer");
	addCustomer.addEventListener("click", CustomerAdd);
}

async function CustomerAdd(){
	const inputs = ["customerFirstName", "customerLastName", "customerCompanyName", "customerShippingAddr"];
    const allFilled = inputs.every(id => document.getElementById(id).value.trim() !== "");
	const createCustomerMessageFieldDiv = document.getElementById('createCustomerUpdateMessage');
	createCustomerMessageFieldDiv.innerHTML = '';
	createCustomerMessageFieldDiv.style.backgroundColor = '';
	
	if(allFilled){
		try {
			const customerData = {
				firstName: document.getElementById("customerFirstName").value,
				lastName: document.getElementById("customerLastName").value,
				companyName: document.getElementById("customerCompanyName").value,
				shippingAddress: document.getElementById("customerShippingAddr").value
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
			createCustomerMessageFieldDiv.style.backgroundColor = 'green';
        } catch (error) {
            console.error('Error adding customer:', error);
			createCustomerMessageFieldDiv.innerHTML = '!: 409-Customer Already Exists';
			createCustomerMessageFieldDiv.style.backgroundColor = 'red';
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

