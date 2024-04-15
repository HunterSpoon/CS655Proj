window.addEventListener("DOMContentLoaded", domLoaded);
const serverUrl = 'http://localhost:3000';
var currentMaterialID = 0;

function domLoaded() {
    main();

    //add event listeners
    document.getElementById('materialBrowserPrevmaterial').addEventListener('click', GetPreviousMaterial);
    document.getElementById('materialBrowserNextmaterial').addEventListener('click', nextMaterial);
    document.getElementById('materialBrowserUpdate').addEventListener('click', updateMaterial);
    document.getElementById('materialBrowserDelete').addEventListener('click', deleteMaterial);
}

/*      
    <div id="materialsBrowserID">Material ID:</div>
    <div id="materialsBrowserType">Type:</div>
    <div id="materialsBrowserPrice">Price:</div>
    <div id="materialsBrowserColor">Color:</div>
    <div id="materialsBrowserInventory">Inventory Info:</div>
*/

async function main() {
    document.getElementById('materialBrowserMessageDiv').innerHTML = "Working";
    currentMaterialID = await getFirstMaterial();
    await displayMaterial(currentMaterialID);
}

//function to fetch the next material in the database via get request to /materials/nextMaterial
async function nextMaterial() {
    try {
        const response = await fetch(`${serverUrl}/materials/nextMaterial?materialID=${currentMaterialID}`);

        //check if the response if 404
        if (response.status === 404) {
            document.getElementById('materialBrowserMessageDiv').innerHTML = "No next material found";
            document.getElementById('materialBrowserMessageDiv').style.color = "red";
            return;
        } else if (!response.ok) { //check if response is not ok
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else { //if response is ok
            const data = await response.json();
            document.getElementById('materialBrowserMessageDiv').innerHTML = '';
            currentMaterialID = data.nextMaterialID;
            await displayMaterial(currentMaterialID);
        }
    } catch (error) {
        console.error('Error getting next material:', error);
        document.getElementById('materialBrowserMessageDiv').innerHTML = "Error getting next material";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
    }
}

//function to delete the material with the given materialID via post request to /materials/delete
async function deleteMaterial() {
    document.getElementById('materialBrowserMessageDiv').innerHTML = '';
    document.getElementById('materialBrowserMessageDiv').style.color = '';

    //promt the user if they are sure, and exit function if they are not
    if (!confirm("Are you sure you want to delete this material? This action will delete all related records and cannot be undone.")){
        return;
    }
    try {
        const response = await fetch(`${serverUrl}/materials/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                material_id: currentMaterialID
            })
        });

        //check if response is ok
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            document.getElementById('materialBrowserMessageDiv').innerHTML = "Material deleted";
            document.getElementById('materialBrowserMessageDiv').style.color = "green";
            currentMaterialID = await getFirstMaterial();
            await displayMaterial(currentMaterialID);
        }
    } catch (error) {
        console.error('Error deleting material:', error);
        document.getElementById('materialBrowserMessageDiv').innerHTML = "Error deleting material";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
    }
}

//function to update the material with the given materialID via post request to /materials/update
async function updateMaterial() {
    //check if at least one field is not empty
    const inputs =["materialID",  "materialPrice",  "materialColor"]
    const atLeastOneFilled = inputs.some(id => document.getElementById(id).value.trim() !== "");

    document.getElementById('materialBrowserMessageDiv').innerHTML = '';
    document.getElementById('materialBrowserMessageDiv').style.color = '';

    if (!atLeastOneFilled) {
        document.getElementById('materialBrowserMessageDiv').innerHTML = "At least one field must be filled";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
        return;
    }else{
        try {
            const response = await fetch(`${serverUrl}/materials/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    material_id: currentMaterialID,
                    material_type: document.getElementById('materialID').value,
                    material_price: document.getElementById('materialPrice').value,
                    material_color: document.getElementById('materialColor').value
                })
            });

            //check if response is ok
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            } else {
                displayMaterial(currentMaterialID);
                document.getElementById('materialBrowserMessageDiv').innerHTML = "Material updated";
                document.getElementById('materialBrowserMessageDiv').style.color = "green";
            }
        } catch (error) {
            console.error('Error updating material:', error);
            document.getElementById('materialBrowserMessageDiv').innerHTML = "Error updating material";
            document.getElementById('materialBrowserMessageDiv').style.color = "red";
        }
    }
}

//function to fetch the previous material in the database via get request to /materials/prevMaterial
async function GetPreviousMaterial() {
    try {
        const response = await fetch(`${serverUrl}/materials/previousMaterial?materialID=${currentMaterialID}`);

        //check if the response if 404
        if (response.status === 404) {
            document.getElementById('materialBrowserMessageDiv').innerHTML = "No previous material found";
            document.getElementById('materialBrowserMessageDiv').style.color = "red";
            return;
        } else if (!response.ok) { //check if response is not ok
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else { //if response is ok
            const data = await response.json();
            document.getElementById('materialBrowserMessageDiv').innerHTML = '';
            currentMaterialID = data.prevMaterialID;
            await displayMaterial(currentMaterialID);
        }
    } catch (error) {
        console.error('Error getting previous material:', error);
        document.getElementById('materialBrowserMessageDiv').innerHTML = "Error getting previous material";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
    }
}

//function to get the first material in the database via get request to /materials/firstMaterial
async function getFirstMaterial() {
    try {
        const response = await fetch(`${serverUrl}/materials/firstMaterial`);

        //check if response is ok
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            document.getElementById('materialBrowserMessageDiv').innerHTML = '';
            return data.minMaterialId;
        }
    } catch (error) {
        console.error('Error getting first customer:', error);
        document.getElementById('materialBrowserMessageDiv').innerHTML = "Error getting first material";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
    }
}

//function to get material data via get request to /materials/lookUp
async function getMaterialData(materialID) {
    try {
        const response = await fetch(`${serverUrl}/materials/lookUp?materialID=${materialID}`);

        //check if response is ok
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        } else {
            const data = await response.json();
            const isNotEmpty = !!data && Object.keys(data).length;
            if (isNotEmpty) { //check if data is not empty
                for (const obj of data) { //iterate through data
                    return obj; //return the first object
                }
            } else {
                document.getElementById('materialBrowserMessageDiv').innerHTML = "No material data found";
                document.getElementById('materialBrowserMessageDiv').style.color = "red";
            }
        }
    } catch (error) {
        console.error('Error getting material data:', error);
        document.getElementById('materialBrowserMessageDiv').innerHTML = "Error getting material data";
        document.getElementById('materialBrowserMessageDiv').style.color = "red";
    }
}

//function to display the material with the given materialID
async function displayMaterial(materialID) {
    const materialData = await getMaterialData(materialID);
    document.getElementById('materialsBrowserID').innerHTML = `Material ID: ${materialData.material_id}`;
    document.getElementById('materialsBrowserType').innerHTML = `Type: ${materialData.material_type}`;
    document.getElementById('materialsBrowserPrice').innerHTML = `Price: ${materialData.material_price}`;
    document.getElementById('materialsBrowserColor').innerHTML = `Color: ${materialData.material_color}`;
    document.getElementById('materialsBrowserInventory').innerHTML = `Inventory Info: <br> - On Hand:${materialData.on_hand} <br> - Last Restock:${materialData.last_restock}`;
}