// client.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

function domLoaded() {
	document.addEventListener('DOMContentLoaded', fetchCustomers);
	
	let btnLookUp = document.getElementById("CompanyInputButton");
	btnLookUp.addEventListener("click", fetchCustomers);
}

// Function to fetch customer data and update the div
async function fetchCustomers() {
	const company_name = document.getElementById("CompanyInput").value;
	
	if(company_name != ""){
		try {
			const response = await fetch(`${serverUrl}/customers/lookUpByCompany?company_name=${encodeURIComponent(company_name)}`);
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

