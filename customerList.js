// client.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

function domLoaded() {
    fetchCustomers();
};

//function that fetches all customers from the server via /customers/All
async function fetchCustomers() {
    try {
        const response = await fetch(`${serverUrl}/customers/All`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        displayCustomers(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

//function that displays the customers in a table
function displayCustomers(data) {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = `
        <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Company</th>
            <th>Address</th>
        </tr>
    `;
    data.forEach(customer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${customer.customer_id}</td>
            <td>${customer.first_name}</td>
            <td>${customer.last_name}</td>
            <td>${customer.company_name}</td>
            <td>${customer.shipping_address}</td>
        `;
        customerList.appendChild(tr);
    });
}