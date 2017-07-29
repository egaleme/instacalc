var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

var showUpdate = Observable(false);
var editedProduct = Observable();
Context.products_sales.clear();
Context.totalamount.value = 0;

var price = Observable();

var total = Context.totalamount.map(function(amt) {
	return "Total : =N= " + amt.toFixed(2)
})

function putSales() {
	if (!price.value || isNaN(price.value)) {
    //errField.value = "please supply all fields"
    return;
  }
	var product_id = (Math.floor(Math.random() * 5000000) + Context.products.length);
	Context.addProductSales(product_id, "others", price.value, 1);
	price.value = '';
}

function deleteProduct(args) {
	var product = args.data
	Context.removeProductSales(product)
}

var po;
function editProduct(args) {
	editedProduct.value = args.data;
	po = args.data
	showUpdate.value = !showUpdate.value
}

var editedPrice = editedProduct.map(function(prod) {
	return prod.price
})

var editedquantity = editedProduct.map(function(prod) {
	return prod.quantity
})

function updateProduct() {
	Context.editProductSales(po.id, po.name, po.batchno, editedquantity.value, po.expiringdate, editedPrice.value)
	showUpdate.value = !showUpdate.value
	editedPrice.value = ''
}

function enterSales() {
	Context.closeSales();
	Context.totalamount.value = 0;
}

function cancelUpdate() {
	showUpdate.value = !showUpdate.value
}

module.exports = {
	products: Context.products_sales,
	total,
	price,
	putSales,
	enterSales,
	deleteProduct,
	editProduct,
	editedPrice,
	updateProduct,
	editedquantity,
	showUpdate,
	cancelUpdate
}