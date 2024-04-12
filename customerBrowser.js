// customerBrowser.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';

async function domLoaded() {
	
    //initalFill();
    const minCustId = await (getFirstCustomerID());
    initalFill(minCustId);

    //document.addEventListener('DOMContentLoaded', fetchCustomers);
}

async function initalFill(minCustId){

    custBrowserID = document.getElementById("custBrowserID");
    custBrowserFirstName = document.getElementById("custBrowserFirstName");
    custBrowserLastName = document.getElementById("custBrowserLastName");
    custBrowserCompanyName = document.getElementById("custBrowserCompanyName");
    custBrowserAddr = document.getElementById("custBrowserAddr");

    const customerData = await GetCustomerData(minCustId);
    console.log(customerData);

    custBrowserID.innerHTML= 'Customer ID: ' + customerData.customer_id;
    console.log(customerData.customer_id);
    custBrowserFirstName.innerHTML= 'First Name: ' + customerData.first_name;
    custBrowserLastName.innerHTML= 'Last Name: ' + customerData.last_name;
    custBrowserCompanyName.innerHTML= 'Company Name: ' + customerData.company_name;
    custBrowserAddr.innerHTML='Address: ' + customerData.shipping_address;
}

async function GetCustomerData(customer_id){
    try{
        const customerData ={
            lookUpID: customer_id,
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

        const isNotEmpty = !!data && Object.keys(data).length;
        if (isNotEmpty){
            for (const obj of data) {
                return obj;
            }
        }else{
            console.log('No Customers match ID:' + customer_id);
        }
    }catch (error){
        console.error('Error looking up customer:', error);
    }
        
}

async function getFirstCustomerID(){
    const response = await fetch(`${serverUrl}/customers/firstCustomer`);
			if (!response.ok) {
				throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
            return data.minCustomerId;
}