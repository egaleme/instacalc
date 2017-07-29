var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

var modal = Observable(false);

var products = Context.products.map(function(prod) {
	prod.price = Number(prod.price).toFixed(2)
	return prod
})

function product(args) {
	Context.product.value = args.data
	modal.value = !modal.value
}

function deleteProduct() {
	//var product = args.data
	Context.deleteProduct(Context.product.value)
	modal.value = !modal.value
}

function cancelDelete() {
	modal.value = !modal.value
}

module.exports = {
	products,
	product,
	deleteProduct,
	showModal: modal,
	cancelDelete
}