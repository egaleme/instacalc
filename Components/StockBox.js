var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

var name = Observable();
var batchno = Observable();
var price = Observable();
var quantity = Observable();
var expiringdate = Observable();
var errField = Observable();

name.onValueChanged(module, function() {
	errField.value = ''
})

function addProduct() {
	if (!name.value || !batchno.value || !quantity.value || !expiringdate.value || !price.value || isNaN(price.value) || isNaN(quantity.value)) {
    errField.value = "please fill all fields correctly"
    return;
  }	
	Context.addProduct(name.value, price.value, batchno.value, expiringdate.value, quantity.value)
	name.value = '';
	batchno.value = '';
	expiringdate.value = '';
	quantity.value = '';
	price.value = ''
	errField.value = '';
}
var showUpdate = Context.switchFromUpdateToAdd.map(function(sw) {
	return sw
})
module.exports = {
	name,
	batchno,
	quantity,
	expiringdate,
	price,
	addProduct,
	errField,
	showUpdate
}