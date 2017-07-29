var Observable = require("FuseJS/Observable");
var Context = require("Modules/Context");

function putSales(args) {
	var product = args.data;
	Context.addProductSales(product.id, product.name, product.price, 1, product.batchno, product.expiringdate)
}

var products = Context.products.map(function(prod) {
	return prod
})

module.exports = {
	products,
	putSales
	}