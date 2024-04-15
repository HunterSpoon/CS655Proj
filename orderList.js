//orderList.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';


function domLoaded(){
    main();
}

async function main(){
    const [orders, order_items, materials] = await Promise.all([fetchOrders(), fetchOrder_Items(), fetchMaterials()]);
    fillOrderTable(orders, order_items, materials);
}

//function that fetches all orders from database via get request to /orders/All
async function fetchOrders(){
    try{
        const response = await fetch(`${serverUrl}/orders/All`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

//function that fetches all order_items via get request to /orderItems/All
async function fetchOrder_Items(){
    try{
        const response = await fetch(`${serverUrl}/orderItems/All`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

//function that fetches all material data via get request to /materials/All
async function fetchMaterials(){
    try{
        const response = await fetch(`${serverUrl}/materials/All`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

//function that returns an array of order_items that belong to a specific order
function getOrderItems(orderId, order_items){
    return order_items.filter(order_item => order_item.order_id === orderId);
}

//function that searches for a material_id in the materials array and returns the material object
function getMaterial(materialId, materials){
    return materials.find(material => material.material_id === materialId);
}

//function that fills the order table with order data
function fillOrderTable(orders, order_items, materials){
    const orderDiv = document.getElementById("orderList");
    orderDiv.innerHTML = `
        <table id="orderList">
            <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Customer ID</th>
                <th>Tracking Info</th>
                <th>Items On Order</th>
            </tr>
        </table>
    `;

    for (const order of orders){
        //gets all order items that belong to the order
        const orderItems = getOrderItems(order.order_id, order_items);

        //get order items 
        let orderItemsString = '';
        for (const orderItem of orderItems){
            const material = getMaterial(orderItem.material_id, materials);
            orderItemsString += `${material.material_type} - ${material.material_color} x ${orderItem.quantity}, `;
        }

        //fill the cell with the order data
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.order_date}</td>
            <td>${order.customer_id}</td>
            <td>${order.order_tracking_info}</td>
            <td>${orderItemsString}</td>
        `;
        //append the tr to the orderDiv
        orderDiv.appendChild(tr);
    }
}
