var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

var errField = Observable();

var id = Context.product.map(function(prod) {
	return prod.id
});

var name = Context.product.map(function(prod) {
	return prod.name
});

var price = Context.product.map(function(prod) {
	return prod.price
});

var batchno = Context.product.map(function(prod) {
	return prod.batchno
});

var quantity = Context.product.map(function(prod) {
	return prod.quantity
});

var expiringdate = Context.product.map(function(prod) {
	return prod.expiringdate
});

function updateProduct() {
	if (!name.value || !price.value || !batchno.value || !expiringdate.value || !quantity.value || isNaN(price.value) || isNaN(quantity.value)) {
		errField.value = "could not update. please fill correctly"
		return;
	}

	Context.updateProduct(id.value, name.value, batchno.value, quantity.value, expiringdate.value, price.value)
	errField.value = '';
	name.value = '';
	batchno.value = '';
	expiringdate.value = '';
	quantity.value = '';
	price.value = ''
	Context.switchFromUpdateToAdd.value = false;
}

function cancelUpdate() {
	errField.value = '';
	name.value = '';
	batchno.value = '';
	expiringdate.value = '';
	quantity.value = '';
	price.value = ''
	Context.switchFromUpdateToAdd.value = !Context.switchFromUpdateToAdd.value;
}

module.exports = {
	name,
	price,
	quantity,
	expiringdate,
	batchno,
	id,
	errField,
	updateProduct,
	cancelUpdate
}