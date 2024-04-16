//orderBrowser.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';
let currentOrder = 0;
let orderItems = [];


async function domLoaded() {
    Main();

    //event listener for the next order button
    const orderBrowserNextOrder = document.getElementById('orderBrowserNextOrder');
    orderBrowserNextOrder.addEventListener('click', nextOrder);

    //event listener for the previous order button
    const orderBrowserPrevOrder = document.getElementById('orderBrowserPrevOrder');
    orderBrowserPrevOrder.addEventListener('click', previousOrder);

    //event listener for the update order button
    const orderBrowserUpdate = document.getElementById('orderBrowserUpdate');
    orderBrowserUpdate.addEventListener('click', updateCurrentOrder);

    //event listener for the delete order button
    const orderBrowserDelete = document.getElementById('orderBrowserDelete');
    orderBrowserDelete.addEventListener('click', deleteCurrentOrder);

    //event listener for the add order item button
    const orderBrowserAddItem = document.getElementById('orderBrowserAddItem');
    orderBrowserAddItem.addEventListener('click', addOrderItem);
}

async function Main() {

    //get the first order
    const firstOrder = await getFirstOrder();
    currentOrder = firstOrder;

    await reLoad();
}

async function reLoad() {

    const [orderDetails, customerDetails, totalOfMaterials, orderItems] = await Promise.all([
        getOrderDetails(currentOrder),
        getCustomerDetails(currentOrder),
        getTotalOfMaterials(currentOrder),
        getOrderItems(currentOrder)
    ]);

    displayOrderDetails(orderDetails);
    displayCustomerDetails(customerDetails);
    displayOrderTotal(totalOfMaterials);
    displayOrderItems(orderItems);
}

//function that prompts the user for the materialID and quantity to add to the order via post request to /orderItems/addNew
async function addOrderItem() {
    const materialID = prompt("Enter the Material ID to add to the order:");
    if (materialID === null || materialID === '') {
        return;
    }
    const quantity = prompt("Enter the Quantity of the Material to add to the order:");
    if (quantity === null || quantity === '') {
        return;
    }

    try {
        const response = await fetch(`${serverUrl}/orderItems/addNew`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderID: currentOrder,
                materialID: materialID,
                quantity: quantity
            })
        });

        document.getElementById('orderBrowserUpdateCustomerData').innerHTML = '';
        document.getElementById('orderBrowserUpdateCustomerData').style.color = '';

        //validate the response
        if (response.status === 404) {
            document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'Material does not exist.';
            document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            reLoad();
            return;
        }
    } catch (Error) {
        console.error(Error);
    }
}


//function that updates the current order via post request to /orders/update
async function updateCurrentOrder() {
    const orderID = currentOrder;
    const inputs = ["orderBrowserUpdateOrderDate", "orderBrowserUpdateTrackingInfo", "orderBrowserUpdateCustomerId"]
    const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");

    if (!atLeastOneFilled) {
        document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'Please fill in at least one field';
        document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
        return;
    } else {
        try {
            const response = await fetch(`${serverUrl}/orders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderID: orderID,
                    orderDate: document.getElementById('orderBrowserUpdateOrderDate').value.trim(),
                    orderTrackingInfo: document.getElementById('orderBrowserUpdateTrackingInfo').value.trim(),
                    customerID: document.getElementById('orderBrowserUpdateCustomerId').value.trim()
                })
            });

            document.getElementById('orderBrowserUpdateCustomerData').innerHTML = '';
            document.getElementById('orderBrowserUpdateCustomerData').style.color = '';

            //validate the response
            if (response.status === 404) {
                document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'Order Not Found';
                document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            } else if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            } else {
                const data = await response.json();
                reLoad();
                return;
            }
        } catch (Error) {
            console.error(Error);
        }
    }
};


//function to delete the current order via post request to /orders/delete
async function deleteCurrentOrder() {
    const orderID = currentOrder;
    try {
        const response = await fetch(`${serverUrl}/orders/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderID: orderID
            })
        });

        document.getElementById('orderBrowserUpdateCustomerData').innerHTML = '';
        document.getElementById('orderBrowserUpdateCustomerData').style.color = '';

        //validate the response
        if (response.status === 404) {
            document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'Order Not Found';
            document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            currentOrder = await getFirstOrder();
            reLoad();
            return;
        }
    } catch (Error) {
        console.error(Error);
    }
}

//function to navigate to the next order by getting the next orderID via get request to /orders/nextOrder
async function nextOrder() {
    try {
        const response = await fetch(`${serverUrl}/orders/nextOrder?orderID=${currentOrder}`);

        document.getElementById('orderBrowserUpdateCustomerData').innerHTML = '';
        document.getElementById('orderBrowserUpdateCustomerData').style.color = '';

        //validate the response
        if (response.status === 404) {
            document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'Last Order';
            document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            currentOrder = data.nextOrderID;
            reLoad();
            return;
        }
    } catch (Error) {
        console.error(Error);
    }
}

//function to navigate to the previous order by getting the previous orderID via get request to /orders/previousOrder
async function previousOrder() {
    try {
        const response = await fetch(`${serverUrl}/orders/previousOrder?orderID=${currentOrder}`);

        document.getElementById('orderBrowserUpdateCustomerData').innerHTML = '';
        document.getElementById('orderBrowserUpdateCustomerData').style.color = '';

        //validate the response
        if (response.status === 404) {
            document.getElementById('orderBrowserUpdateCustomerData').innerHTML = 'First Order';
            document.getElementById('orderBrowserUpdateCustomerData').style.color = 'red';
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            currentOrder = data.prevOrderID;
            reLoad();
            return;
        }
    } catch (Error) {
        console.error(Error);
    }
}




//function to display the order items and fill the orderItems array with OrderItem objects
function displayOrderItems(orderItems) {
    const orderItemsTable = document.getElementById('orderBrowserOrderItemsTable');
    orderItemsTable.innerHTML = '';
    //fill with header rows
    orderItemsTable.innerHTML = `<tr>
        <th>Material ID</th>
        <th>Material Type</th>
        <th>Material Color</th>
        <th>Material Price</th>
        <th>Material Quantity</th>
        <th>Update Quantity</th>
        <th>Delete Item</th>
    </tr>`;
    //fill with order items
    orderItems.forEach(orderItem => {
        const newRow = document.createElement('tr');

        //fill the orderItems array with OrderItem objects
        //this places buttons in the table to update the quantity and delete the item
        newRow.innerHTML = `<td>${orderItem.material_id}</td>
        <td>${orderItem.material_type}</td>
        <td>${orderItem.material_color}</td>
        <td>${orderItem.material_price}</td>
        <td>${orderItem.quantity}</td>
        <td><button onclick="updateOrderItemQuantityHelper(${orderItem.material_id})">Update Quantity</button></td>
        <td><button onclick="deleteOrderItemHelper(${orderItem.material_id})">Delete Item</button></td>
        `
        orderItemsTable.appendChild(newRow);
    });
}

//helper function to facilitate a call to deleteOrderItem
function deleteOrderItemHelper(materialID) {
    //prompt the user to confirm the deletion
    if (confirm("Are you sure you want to delete this item?")) {
        deleteOrderItem(currentOrder, materialID).then(() => {
            reLoad();
            return;
        });
    } else {
        return;
    }
}

//function to delete an order item from the order
async function deleteOrderItem(orderID, materialID) {
    try {
        const response = await fetch(`${serverUrl}/orderItems/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderid: orderID,
                materialID: materialID
            })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (Error) {
        console.error(Error);
    }
}

//helper function to facilitate a call to updateOrderItemQuantity
function updateOrderItemQuantityHelper(materialID) {
    const quantity = prompt("Enter the new quantity for this item:");
    if (quantity === null || quantity === '') {
        return;
    }
    updateOrderItemQuantity(currentOrder, materialID, quantity).then(() => {
        reLoad();
        return;
    });
}

//function to update the quantity of an order item
async function updateOrderItemQuantity(orderID, materialID, quantity) {
    try {
        const response = await fetch(`${serverUrl}/orderItems/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderid: orderID,
                materialID: materialID,
                quantity: quantity
            })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (Error) {
        console.error(Error);
    }
}

//function to display the order details
function displayOrderDetails(orderDetails) {
    const orderBrowserOrderID = document.getElementById('orderBrowserOrderID');
    orderBrowserOrderID.innerHTML = `Order ID: ${orderDetails.order_id}`;

    const orderBrowserOrderDate = document.getElementById('orderBrowserOrderDate');
    orderBrowserOrderDate.innerHTML = `Order Date: ${orderDetails.order_date}`;

    const orderBrowserOrderTrackingInfo = document.getElementById('orderBrowserOrderTrackingInfo');
    orderBrowserOrderTrackingInfo.innerHTML = `Tracking Info: ${orderDetails.order_tracking_info}`;
}

//function to display the order total
function displayOrderTotal(totalOfMaterials) {
    const orderTotal = document.getElementById('orderTotal');
    orderTotal.innerHTML = `Order Total: $${totalOfMaterials}`;
}


//function to display the customer details
function displayCustomerDetails(customerDetails) {
    const orderBrowserCustomerID = document.getElementById('orderBrowserCustomerId');
    orderBrowserCustomerID.innerHTML = `Customer ID: ${customerDetails.customer_id}`;

    const orderBrowserCustomerData = document.getElementById('orderBrowserCustomerData');
    orderBrowserCustomerData.innerHTML = `<ul>
    <li>Customer Name: ${customerDetails.last_name}, ${customerDetails.first_name}</li>
    <li>Company Name: ${customerDetails.company_name}</li>
    <li>Customer Address: ${customerDetails.shipping_address}</li></ul>`
}

//function that gets the order items for the orderID via get request to /orderItems/AllItemsOnOrder/Specific
async function getOrderItems(orderID) {
    try {
        const response = await fetch(`${serverUrl}/orderItems/AllItemsOnOrder/Specific?orderID=${orderID}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (Error) {
        console.error(Error);
    }
}


//function that gets the customer details for the customerID on the order via get request to customers/lookUp/ByOrderID
async function getCustomerDetails(orderID) {
    try {
        const response = await fetch(`${serverUrl}/customers/lookUp/ByOrderID?orderID=${orderID}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data[0];
        }
    } catch (Error) {
        console.error(Error);
    }
}

//function that gets sum of all orders via get request to /order/TotalOfMaterials
async function getTotalOfMaterials(orderID) {
    try {
        const response = await fetch(`${serverUrl}/order/TotalOfMaterials?orderID=${orderID}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data.totalMaterials;
        }
    } catch (Error) {
        console.error(Error);
    }
}


//function that gets the order details via get request to /orders/lookUp/Specific
async function getOrderDetails(orderID) {
    try {
        const response = await fetch(`${serverUrl}/orders/lookUp/Specific?orderID=${orderID}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data[0];
        }
    } catch (Error) {
        console.error(Error);
    }
}

//function that gets the first order via get request to /orders/firstOrder
async function getFirstOrder() {
    try {
        const response = await fetch(`${serverUrl}/orders/firstOrder`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            return data.minOrderId;
        }
    } catch (Error) {
        console.error(Error);

    }
};