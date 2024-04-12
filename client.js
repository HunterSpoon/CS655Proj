// client.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

function domLoaded() {
	//document.addEventListener('DOMContentLoaded', fetchCustomers);
	

	//customer Center
	
	let btnOldCreateCust = document.getElementById("CompanyInputButton");
	btnOldCreateCust.addEventListener("click", fetchCustomers);
	
	//create customer
	let btnCreateCust = document.getElementById("addNewCustomer");
	btnCreateCust.addEventListener("click", CustomerAdd);

	//look up customer
	let btnCustLookup = document.getElementById("CustomerlookUp");
	btnCustLookup.addEventListener("click", CustomerLookup)


}

async function CustomerLookup(){
	const inputs =["lookUpID", "lookUpFirstName",  "lookUpLastName",  "lookUpCompany", "lookUpAddr"]
	const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");
	const lookUpCustomerDiv = document.getElementById("lookUpCustomerDiv");

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
				for (const obj of data) {
					dataRow =  `Customer ID: ${obj.customer_id} Name: ${obj.last_name}, ${obj.first_name} Company Name: ${obj.company_name} Shipping Address: ${obj.shipping_address}`;
					appendDataToElement(dataRow, "lookUpCustomerDiv")
				}
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


function clearInnerHtml(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = "";
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

