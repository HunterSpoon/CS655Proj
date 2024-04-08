// client.js

// Replace with your actual server URL
const serverUrl = 'http://localhost:3000'; // Example: 'http://your-server-domain.com'

// Function to fetch customer data and update the div
async function fetchCustomers() {
    const company_name = 'NexTech'; // Replace with the actual company name

    try {
        const response = await fetch(`${serverUrl}/customers?company_name=${encodeURIComponent(company_name)}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayCustomers(data);
    } catch (error) {
        console.error('Error fetching data:', error);
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

// Call the fetchCustomers function when the page loads
document.addEventListener('DOMContentLoaded', fetchCustomers);
