// customerBrowser.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';
var currentCustID = 0;

async function domLoaded() {
	
    //fillCustomer();
    const minCustId = await (getFirstCustomerID());
    currentCustID = minCustId;
    fillCustomer(currentCustID);

    // add event listeners to custBrowserPrevCust, custBrowserNextCust, custBrowserUpdate, and custBrowserDelete
    const custBrowserPrevCust = document.getElementById("custBrowserPrevCust");
    custBrowserPrevCust.addEventListener("click", fetchPreviousCustomer);

    const custBrowserNextCust = document.getElementById("custBrowserNextCust");
    custBrowserNextCust.addEventListener("click", fetchNextCustomer);

    const custBrowserUpdate = document.getElementById("custBrowserUpdate");
    custBrowserUpdate.addEventListener("click", updateCurrentCustomer);

    const custBrowserDelete = document.getElementById("custBrowserDelete");
    custBrowserDelete.addEventListener("click", deleteCurrentCustomer);
};



//function that fetches the next customer
async function fetchNextCustomer(){
    console.log('fetchNextCustomer');
    const custBrowserMessageDiv = document.getElementById("custBrowserMessageDiv");
    custBrowserMessageDiv.innerHTML='';
    let tempCustID = await GetNextCustomer();
    fillCustomer(tempCustID);
    clearInputFields();
};

//function that fetches the previous customer
async function fetchPreviousCustomer(){
    const custBrowserMessageDiv = document.getElementById("custBrowserMessageDiv");
    custBrowserMessageDiv.innerHTML='';
    let tempCustID = await GetPreviousCustomer();
    fillCustomer(tempCustID);
    clearInputFields();
};

//function that deletes the current customer
async function deleteCurrentCustomer(){

    //promt the user if they are sure, and exit function if they are not
    if (!confirm("Are you sure you want to delete this customer? This action will delete all related records and cannot be undone.")){
        return;
    }

    let tempCustID = currentCustID;

    const customerData = {
        customerID: tempCustID
    }

    try{
        const response = await fetch(`${serverUrl}/customers/Delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }else{
            //update the customer data on screen by filling it with first customer data and clear the input fields
            const minCustId = await (getFirstCustomerID());
            fillCustomer(minCustId);
            clearInputFields();
            document.getElementById('custBrowserMessageDiv').innerHTML='!: Customer Deleted';
            document.getElementById('custBrowserMessageDiv').style.color="green";
        }

    }catch (error){
        console.error('Error looking up customer:', error);
        document.getElementById('custBrowserMessageDiv').innerHTML='!: Error looking up customer';
        document.getElementById('custBrowserMessageDiv').style.color="red";
    }
}



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

            const response = await fetch(`${serverUrl}/customers/Update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }else{
                //update the customer data on screen and clear the input fields
                fillCustomer(tempCustID);
                clearInputFields();
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


//function that clears all of the input fields
function clearInputFields(){
    const inputs =["customerFirstName",  "customerLastName",  "customerCompanyName", "customerShippingAddr"]
    inputs.forEach(id => document.getElementById(id).value = "");
};

async function fillCustomer(targetCustID){

    custBrowserID = document.getElementById("custBrowserID");
    custBrowserFirstName = document.getElementById("custBrowserFirstName");
    custBrowserLastName = document.getElementById("custBrowserLastName");
    custBrowserCompanyName = document.getElementById("custBrowserCompanyName");
    custBrowserAddr = document.getElementById("custBrowserAddr");

    //set current customer id
    currentCustID = targetCustID;

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
        const lookUpID = tempCustID;
        
        // Fetch data from the server using the specified URL
        const response = await fetch(`${serverUrl}/customers/previousCustomer?lookUpID=${encodeURIComponent(lookUpID)}`);

        //check if the response status is 404
        if (response.status === 404) {
            console.log('No next customer found after Customer ID:' + tempCustID);
            document.getElementById('custBrowserMessageDiv').innerHTML='No next customers found';
            return tempCustID; // Return the current customer ID if no next customers are found
        }else if (!response.ok) { //catch any other network errors
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response data as JSON

        // Check if the data is not empty
        const isNotEmpty = !!data && Object.keys(data).length; 
        if (isNotEmpty){
            //return next customer ID
            return data.prevCustID;
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

        //check if the response status is 404
        if (response.status === 404) {
            console.log('No Previous Customers Before Customer ID:' + tempCustID);
            document.getElementById('custBrowserMessageDiv').innerHTML='Last Customer';
            return tempCustID; // Return the current customer ID if no previous customers are found
        }else if (!response.ok) { //catch any other network errors
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Parse the response data as JSON

        // Check if the data is not empty
        const isNotEmpty = !!data && Object.keys(data).length;
        if (isNotEmpty) {
            //return the object
            return data.nextCustID;
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