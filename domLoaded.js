function domLoaded() {
	//document.addEventListener('DOMContentLoaded', fetchCustomers);
	//customer Center
	//create customer
	let btnCreateCust = document.getElementById("addNewCustomer");
	btnCreateCust.addEventListener("click", CustomerAdd);

	//look up customer
	let btnCustLookup = document.getElementById("CustomerlookUp");
	btnCustLookup.addEventListener("click", CustomerLookup);

	//order center
	//order lookup
	let btnOrderLookup = document.getElementById("orderLookUpButton");
	btnOrderLookup.addEventListener("click", OrderLookup);

	//material center
	//material add
	let btnaddNewMaterial = document.getElementById("addNewMaterial");
	btnaddNewMaterial.addEventListener("click", MaterialAdd);

}
