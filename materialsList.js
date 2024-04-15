//orderList.js
window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';


function domLoaded(){
    main();
}

async function main(){
    const [materials] = await Promise.all([fetchMaterials()]);
    fillMaterialTable(materials);
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

//function that fills the table with material data
function fillMaterialTable(materials){
    const table = document.getElementById('MaterialsList');
    for (let material of materials){
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${material.material_id}</td>
            <td>${material.material_type}</td>
            <td>${material.material_price}</td>
            <td>${material.material_color}</td>
            <td>${material.on_hand}</td>
            <td>${material.last_restock}</td>
        `;
        table.appendChild(tr);
    }
}