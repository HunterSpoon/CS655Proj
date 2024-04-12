// customerBrowser.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';
var currentCustID = 0;

async function domLoaded() {
	
    //fillCustomer();
    const minCustId = await (getFirstCustomerID());
    currentCustID = minCustId;
    fillCustomer(currentCustID);

    document.addEventListener('custBrowserNextCust', fetchNextCustomer);
    document.addEventListener('custBrowserPrevCust', fetchPreviousCustomer);
};

async function fetchNextCustomer(){
    getElementById('custBrowserMessageDiv').innerHTML='';
    let tempCustID = await GetNextCustomer();
    fillCustomer(tempCustID);
};

async function fetchPreviousCustomer(){
    getElementById('custBrowserMessageDiv').innerHTML='';
    let tempCustID = await GetPreviousCustomer();
    fillCustomer(tempCustID);
};

async function updateCurrentCustomer(){
    let tempCustID = currentCustID;

    const inputs =["customerFirstName",  "customerLastName",  "customerCompanyName", "customerShippingAddr"]
    const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");
    const custBrowserMessageDiv = document.getElementById("custBrowserMessageDiv");

    custBrowserMessageDiv.innerHTML ='';
    custBrowserMessageDiv.style.Color ='';

    if (atLeastOneFilled){
        custBrowserMessageDiv.innerHTML='working';

        try{
            const customerData ={
                customerID: tempCustID,
                customerFirstName: document.getElementById("customerFirstName").value.trim(),
                customerLastName: document.getElementById("customerLastName").value.trim(),
                customerCompanyName: document.getElementById("customerCompanyName").value.trim(),
                customerShippingAddr: document.getElementById("customerShippingAddr").value.trim()
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
            }else{
                custBrowserMessageDiv.innerHTML='!: Updated';
            custBrowserMessageDiv.style.color="green";
            }
            

        }catch (error){
            console.error('Error looking up customer:', error);
            custBrowserMessageDiv.innerHTML='!: Error looking up customer';
            custBrowserMessageDiv.style.color="red";
        }
    }else{
        custBrowserMessageDiv.innerHTML='!: At Least One Field Must Be Filled';
        custBrowserMessageDiv.style.color="red";
    }
};




async function fillCustomer(targetCustID){

    custBrowserID = document.getElementById("custBrowserID");
    custBrowserFirstName = document.getElementById("custBrowserFirstName");
    custBrowserLastName = document.getElementById("custBrowserLastName");
    custBrowserCompanyName = document.getElementById("custBrowserCompanyName");
    custBrowserAddr = document.getElementById("custBrowserAddr");

    const customerData = await GetCustomerData(targetCustID);
    console.log(customerData);

    custBrowserID.innerHTML= 'Customer ID: ' + customerData.customer_id;
    console.log(customerData.customer_id);
    custBrowserFirstName.innerHTML= 'First Name: ' + customerData.first_name;
    custBrowserLastName.innerHTML= 'Last Name: ' + customerData.last_name;
    custBrowserCompanyName.innerHTML= 'Company Name: ' + customerData.company_name;
    custBrowserAddr.innerHTML= 'Address: ' + customerData.shipping_address;
};

// Asynchronous function to retrieve the previous customer
async function GetPreviousCustomer(){
    // Create a temporary variable for the customer ID
    let tempCustID = currentCustID;
    try{
        // Set the lookup ID to the temporary customer ID
        const customerData={
            lookUpID: tempCustID,
        }
        
        // Fetch data from the server using the specified URL
        const response = await fetch(`${serverUrl}/customers/previousCustomer?lookUpID=${encodeURIComponent(lookUpID)}`);

        if (!response.ok) { // Check if the network response is successful
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response data as JSON

        // Check if the data is not empty
        const isNotEmpty = !!data && Object.keys(data).length; 
        if (isNotEmpty){
            // Iterate through the data and return the first object
            for (const obj of data) {
                return obj;
            }
        }else{ // Log a message if no customers match the ID
            console.log('No Customers match ID:' + customer_id);
            getElementById('custBrowserMessageDiv').innerHTML='No Customers match ID:' + customer_id;
        }

    }catch(error){
        // Handle errors related to customer lookup
        console.error('Error looking up customer:', error);
        getElementById('custBrowserMessageDiv').innerHTML= 'Error looking up customer:' + error;
    }
};

// Asynchronous function to retrieve the next customer
async function GetNextCustomer() {
    // Create a temporary variable for the customer ID
    let tempCustID = currentCustID;

    try {
        // Set the lookup ID to the temporary customer ID
        const lookUpID = tempCustID;

        // Fetch data from the server using the specified URL
        const response = await fetch(`${serverUrl}/customers/nextCustomer?lookUpID=${encodeURIComponent(lookUpID)}`);

        if (!response.ok) { // Check if the network response is successful
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response data as JSON

        // Check if the data is not empty
        const isNotEmpty = !!data && Object.keys(data).length;
        if (isNotEmpty) {
            // Iterate through the data and return the first object
            for (const obj of data) {
                return obj;
            }
        }else{ // Log a message if no customers match the ID
            console.log('No Customers match ID:' + customer_id);
            getElementById('custBrowserMessageDiv').innerHTML='No Customers match ID:' + customer_id;
        }

    }catch(error){
        // Handle errors related to customer lookup
        console.error('Error looking up customer:', error);
        getElementById('custBrowserMessageDiv').innerHTML= 'Error looking up customer:' + error;
    }
};

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
        
};

async function getFirstCustomerID(){
    const response = await fetch(`${serverUrl}/customers/firstCustomer`);
			if (!response.ok) {
				throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
			}

			const data = await response.json();
            return data.minCustomerId;
};